import hashlib
import os
import secrets


def hash_password(password: str) -> str:
    """Hash password using PBKDF2 with SHA-256 and a random salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    ).hex()
    return f"{salt}${key}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored salt$key hash."""
    if not hashed_password or "$" not in hashed_password:
        return False
    try:
        salt, key = hashed_password.split("$", 1)
        new_key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        ).hex()
        return secrets.compare_digest(key, new_key)
    except Exception:
        return False
