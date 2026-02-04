"""
Advanced Security Utilities - SQL Injection, XSS, Backdoor prevention
"""
import re
import bleach
from django.utils.html import escape
from django.core.exceptions import ValidationError


# SQL Injection uchun xavfli pattern'lar
SQL_INJECTION_PATTERNS = [
    r"(\bunion\b.*\bselect\b)",
    r"(\bselect\b.*\bfrom\b)",
    r"(\binsert\b.*\binto\b)",
    r"(\bupdate\b.*\bset\b)",
    r"(\bdelete\b.*\bfrom\b)",
    r"(\bdrop\b.*\btable\b)",
    r"(\bexec\b|\bexecute\b)",
    r"(\bor\b.*=.*)",
    r"(\band\b.*=.*)",
    r"(--|#|/\*|\*/)",
    r"(\bxp_cmdshell\b)",
    r"(\bsp_executesql\b)",
    r"(\bshutdown\b)",
]

# XSS uchun xavfli pattern'lar
XSS_PATTERNS = [
    r"<script[^>]*>.*?</script>",
    r"javascript:",
    r"onerror\s*=",
    r"onload\s*=",
    r"onclick\s*=",
    r"<iframe[^>]*>",
    r"<object[^>]*>",
    r"<embed[^>]*>",
    r"eval\s*\(",
    r"expression\s*\(",
]

# File Upload uchun xavfli kengaytmalar (Backdoor prevention)
DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
    '.jar', '.app', '.sh', '.bash', '.zsh', '.ps1', '.py', '.rb',
    '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl'
]

# Ruxsat etilgan file types
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.avi', '.mov']
ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.md']


def sanitize_input(text):
    """
    Input textni tozalash - XSS va SQL injection oldini olish
    """
    if not text or not isinstance(text, str):
        return text
    
    # HTML taglarni olib tashlash (XSS prevention)
    cleaned = bleach.clean(
        text,
        tags=[],  # Hech qanday tag'ga ruxsat bermaymiz
        attributes={},
        strip=True
    )
    
    # SQL injection pattern'larni tekshirish
    text_lower = cleaned.lower()
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            raise ValidationError(
                "Xavfli belgilar topildi. Iltimos, to'g'ri ma'lumot kiriting."
            )
    
    return cleaned


def sanitize_html_output(text, allowed_tags=None):
    """
    HTML output uchun xavfsiz qilish - XSS prevention
    Faqat kerakli taglar qoldiriladi
    """
    if not text or not isinstance(text, str):
        return text
    
    # Default ruxsat etilgan taglar
    if allowed_tags is None:
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']
    
    # Xavfsiz atributlar
    allowed_attrs = {
        'a': ['href', 'title'],
        '*': ['class']
    }
    
    return bleach.clean(
        text,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True
    )


def check_sql_injection(query_string):
    """
    Query string'da SQL injection borligini tekshirish
    """
    if not query_string:
        return False
    
    query_lower = query_string.lower()
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, query_lower, re.IGNORECASE):
            return True
    
    return False


def check_xss_attack(input_string):
    """
    XSS hujum urinishini tekshirish
    """
    if not input_string:
        return False
    
    for pattern in XSS_PATTERNS:
        if re.search(pattern, input_string, re.IGNORECASE):
            return True
    
    return False


def validate_file_upload(filename, allowed_extensions=None):
    """
    File upload xavfsizligini tekshirish - Backdoor prevention
    """
    import os
    
    if not filename:
        raise ValidationError("Fayl nomi bo'sh bo'lishi mumkin emas.")
    
    # Filename ni tozalash
    filename = os.path.basename(filename)
    
    # Fayl kengaytmasini olish
    _, ext = os.path.splitext(filename.lower())
    
    # Xavfli kengaytmalarni tekshirish
    if ext in DANGEROUS_EXTENSIONS:
        raise ValidationError(
            f"Bu turdagi fayllar ({ext}) xavfsizlik sabablariga ko'ra yuklanishi mumkin emas."
        )
    
    # Agar allowed_extensions berilgan bo'lsa, tekshirish
    if allowed_extensions:
        if ext not in allowed_extensions:
            raise ValidationError(
                f"Faqat quyidagi formatdagi fayllar ruxsat etilgan: {', '.join(allowed_extensions)}"
            )
    
    # Double extension attack oldini olish
    # Masalan: file.php.jpg
    parts = filename.split('.')
    if len(parts) > 2:
        for part in parts[:-1]:
            if f'.{part.lower()}' in DANGEROUS_EXTENSIONS:
                raise ValidationError(
                    "Xavfli fayl formati topildi."
                )
    
    # Null byte injection oldini olish
    if '\x00' in filename:
        raise ValidationError("Noto'g'ri fayl nomi.")
    
    return True


def sanitize_filename(filename):
    """
    Fayl nomini xavfsiz qilish
    """
    import os
    import unicodedata
    
    # Basename olish (path traversal oldini olish)
    filename = os.path.basename(filename)
    
    # Unicode ni normalize qilish
    filename = unicodedata.normalize('NFKD', filename)
    
    # Faqat xavfsiz belgilarni qoldirish
    filename = re.sub(r'[^\w\s.-]', '', filename)
    
    # Bir nechta nuqtalarni bitta nuqta bilan almashtirish
    filename = re.sub(r'\.+', '.', filename)
    
    # Bo'sh joylarni pastki chiziq bilan almashtirish
    filename = re.sub(r'\s+', '_', filename)
    
    # Filename ni qisqartirish (maksimum 255 belgi)
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255-len(ext)] + ext
    
    return filename


def check_path_traversal(path):
    """
    Path traversal hujumini oldini olish
    Masalan: ../../etc/passwd
    """
    if not path:
        return False
    
    dangerous_patterns = [
        r'\.\.',  # Parent directory
        r'~',     # Home directory
        r'/etc/', r'/var/', r'/usr/', r'/bin/', r'/sbin/',  # System directories
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, path):
            return True
    
    return False


def validate_url(url):
    """
    URL ni tekshirish - Open Redirect va SSRF oldini olish
    """
    if not url:
        return True
    
    # Faqat HTTP va HTTPS protokollariga ruxsat
    if not url.startswith(('http://', 'https://')):
        raise ValidationError(
            "Faqat HTTP yoki HTTPS URL larga ruxsat etilgan."
        )
    
    # File protocol va boshqa xavfli protokollarni bloklash
    dangerous_protocols = [
        'file://', 'ftp://', 'javascript:', 'data:', 
        'vbscript:', 'ssh://', 'telnet://'
    ]
    
    for protocol in dangerous_protocols:
        if url.lower().startswith(protocol):
            raise ValidationError("Xavfli URL protokoli topildi.")
    
    # Local IP addresslarga so'rov yubormaslik (SSRF prevention)
    local_patterns = [
        r'localhost', r'127\.0\.0\.1', r'0\.0\.0\.0',
        r'192\.168\.', r'10\.', r'172\.(1[6-9]|2[0-9]|3[0-1])\.',
        r'\[::1\]', r'\[::ffff:127\.0\.0\.1\]'
    ]
    
    for pattern in local_patterns:
        if re.search(pattern, url.lower()):
            raise ValidationError(
                "Local serverga so'rov yuborish man etilgan."
            )
    
    return True


def rate_limit_key(request):
    """
    Rate limiting uchun unique key yaratish
    IP va User Agent kombinatsiyasi
    """
    from .middleware import get_client_ip
    
    ip = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')[:50]
    
    return f"{ip}_{hash(user_agent)}"


def check_brute_force(identifier, max_attempts=5, window=300):
    """
    Brute force hujumni tekshirish
    identifier - IP yoki email
    max_attempts - maksimum urinishlar soni
    window - vaqt oynasi (sekundlarda)
    """
    from django.core.cache import cache
    
    cache_key = f'brute_force_{identifier}'
    attempts = cache.get(cache_key, 0)
    
    if attempts >= max_attempts:
        return False  # Bloklangan
    
    # Urinishlar sonini oshirish
    cache.set(cache_key, attempts + 1, window)
    return True


def log_security_event(event_type, details, severity='WARNING'):
    """
    Xavfsizlik hodisalarini log qilish
    """
    import logging
    
    logger = logging.getLogger('core.security')
    
    log_message = f"[SECURITY] {event_type}: {details}"
    
    if severity == 'CRITICAL':
        logger.critical(log_message)
    elif severity == 'ERROR':
        logger.error(log_message)
    elif severity == 'WARNING':
        logger.warning(log_message)
    else:
        logger.info(log_message)
