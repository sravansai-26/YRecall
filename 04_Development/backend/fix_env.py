import os

env_py_path = 'alembic/env.py'
with open(env_py_path, 'r') as f:
    content = f.read()

if 'from app.core.database import db_url' not in content:
    content = content.replace('target_metadata = None', 'from app.core.database import Base, db_url\nfrom app.modules.users.models import User\nfrom app.modules.captures.models import Capture\nfrom app.modules.ai.models import AIConversation, AIMessage, AIEmbedding\ntarget_metadata = Base.metadata')

old_online = """    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )"""
new_online = """    ini_section = config.get_section(config.config_ini_section, {})
    ini_section["sqlalchemy.url"] = db_url
    connectable = engine_from_config(
        ini_section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )"""

if 'ini_section["sqlalchemy.url"] = db_url' not in content:
    content = content.replace(old_online, new_online)

with open(env_py_path, 'w') as f:
    f.write(content)
