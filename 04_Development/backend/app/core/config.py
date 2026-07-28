from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    FIREBASE_SERVICE_ACCOUNT_PATH: str
    GEMINI_API_KEY: str
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str = "mock_webhook_secret" # Optional for local dev without tunnel
    
    # SMTP Config
    SMTP_HOST: str = "smtp.zoho.in"
    SMTP_PORT: int = 465
    SMTP_USER: str = "lyfspot@zohomail.in"
    SMTP_PASSWORD: str = "" # Set in .env
    SMTP_USE_TLS: bool = True
    EMAIL_FROM: str = "YRecall <lyfspot@zohomail.in>"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
