from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Submission, Certificate
from django.conf import settings
import os


@receiver(post_save, sender=Submission)
def create_certificate_on_completion(sender, instance, created, **kwargs):
    """
    Automatically generate a certificate when a submission is marked as completed
    """
    if instance.completed:
        # Check if certificate already exists
        certificate, cert_created = Certificate.objects.get_or_create(
            user=instance.user,
            lesson=instance.assignment.lesson
        )
        
        if cert_created:
            # Generate PDF certificate
            from .utils import generate_certificate_pdf
            
            try:
                pdf_path = generate_certificate_pdf(certificate)
                certificate.pdf_file = pdf_path
                certificate.save()
                
                # Award points to user
                instance.user.points += 50  # 50 points for completing a lesson
                instance.user.save()
                
            except Exception as e:
                print(f"Error generating certificate: {e}")
