from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from datetime import datetime
import os
from django.conf import settings


def generate_certificate_pdf(certificate):
    """
    Generate a beautiful PDF certificate for completed lessons
    """
    # Create certificates directory if it doesn't exist
    cert_dir = os.path.join(settings.MEDIA_ROOT, 'certificates')
    os.makedirs(cert_dir, exist_ok=True)
    
    # File path
    filename = f"certificate_{certificate.certificate_id}.pdf"
    filepath = os.path.join(cert_dir, filename)
    
    # Create PDF
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4
    
    # Background color
    c.setFillColor(colors.HexColor('#f8f9fa'))
    c.rect(0, 0, width, height, fill=True, stroke=False)
    
    # Border
    c.setStrokeColor(colors.HexColor('#4a90e2'))
    c.setLineWidth(3)
    margin = 0.5 * inch
    c.rect(margin, margin, width - 2*margin, height - 2*margin, fill=False, stroke=True)
    
    # Inner decorative border
    c.setStrokeColor(colors.HexColor('#f39c12'))
    c.setLineWidth(1)
    inner_margin = 0.6 * inch
    c.rect(inner_margin, inner_margin, width - 2*inner_margin, height - 2*inner_margin, fill=False, stroke=True)
    
    # Title
    c.setFillColor(colors.HexColor('#2c3e50'))
    c.setFont("Helvetica-Bold", 36)
    title_text = "CERTIFICATE OF ACHIEVEMENT"
    title_width = c.stringWidth(title_text, "Helvetica-Bold", 36)
    c.drawString((width - title_width) / 2, height - 2 * inch, title_text)
    
    # Subtitle
    c.setFont("Helvetica", 14)
    subtitle = "This certifies that"
    subtitle_width = c.stringWidth(subtitle, "Helvetica", 14)
    c.drawString((width - subtitle_width) / 2, height - 2.8 * inch, subtitle)
    
    # Student Name
    c.setFillColor(colors.HexColor('#e74c3c'))
    c.setFont("Helvetica-Bold", 28)
    name = certificate.user.full_name
    name_width = c.stringWidth(name, "Helvetica-Bold", 28)
    c.drawString((width - name_width) / 2, height - 3.5 * inch, name)
    
    # Completion text
    c.setFillColor(colors.HexColor('#2c3e50'))
    c.setFont("Helvetica", 14)
    completion_text = "has successfully completed"
    completion_width = c.stringWidth(completion_text, "Helvetica", 14)
    c.drawString((width - completion_width) / 2, height - 4.2 * inch, completion_text)
    
    # Course Name
    c.setFillColor(colors.HexColor('#27ae60'))
    c.setFont("Helvetica-Bold", 20)
    course_name = certificate.lesson.title
    # Wrap long course names
    if len(course_name) > 50:
        course_name = course_name[:47] + "..."
    course_width = c.stringWidth(course_name, "Helvetica-Bold", 20)
    c.drawString((width - course_width) / 2, height - 4.9 * inch, course_name)
    
    # Category
    c.setFillColor(colors.HexColor('#7f8c8d'))
    c.setFont("Helvetica-Oblique", 12)
    category = f"Category: {certificate.lesson.sub_category.category.display_name} - {certificate.lesson.sub_category.name}"
    category_width = c.stringWidth(category, "Helvetica-Oblique", 12)
    c.drawString((width - category_width) / 2, height - 5.4 * inch, category)
    
    # Date
    c.setFillColor(colors.HexColor('#2c3e50'))
    c.setFont("Helvetica", 11)
    date_text = f"Date of Completion: {certificate.issued_at.strftime('%B %d, %Y')}"
    date_width = c.stringWidth(date_text, "Helvetica", 11)
    c.drawString((width - date_width) / 2, height - 6.2 * inch, date_text)
    
    # Certificate ID
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor('#95a5a6'))
    cert_id_text = f"Certificate ID: {certificate.certificate_id}"
    cert_id_width = c.stringWidth(cert_id_text, "Helvetica", 9)
    c.drawString((width - cert_id_width) / 2, height - 6.6 * inch, cert_id_text)
    
    # Platform name and signature section
    c.setFillColor(colors.HexColor('#34495e'))
    c.setFont("Helvetica-Bold", 16)
    platform_text = "EduShare School"
    platform_width = c.stringWidth(platform_text, "Helvetica-Bold", 16)
    c.drawString((width - platform_width) / 2, 2 * inch, platform_text)
    
    c.setFont("Helvetica-Oblique", 10)
    tagline = "Where Students Teach Students"
    tagline_width = c.stringWidth(tagline, "Helvetica-Oblique", 10)
    c.drawString((width - tagline_width) / 2, 1.6 * inch, tagline)
    
    # Signature line
    c.setStrokeColor(colors.HexColor('#2c3e50'))
    c.setLineWidth(1)
    line_start = width / 2 - 1.5 * inch
    line_end = width / 2 + 1.5 * inch
    c.line(line_start, 1.2 * inch, line_end, 1.2 * inch)
    
    c.setFont("Helvetica", 9)
    signature_text = "Authorized Signature"
    signature_width = c.stringWidth(signature_text, "Helvetica", 9)
    c.drawString((width - signature_width) / 2, 1 * inch, signature_text)
    
    # Save PDF
    c.save()
    
    # Return relative path for Django FileField
    return os.path.join('certificates', filename)
