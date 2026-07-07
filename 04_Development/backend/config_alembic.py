import os

env_py_path = 'alembic/env.py'
if os.path.exists(env_py_path):
    with open(env_py_path, 'r') as f:
        content = f.read()
    
    # Replace target_metadata
    content = content.replace('target_metadata = None', 'from app.core.database import Base\nfrom app.modules.users.models import User\nfrom app.modules.captures.models import Capture\nfrom app.modules.ai.models import AIConversation, AIMessage, AIEmbedding\ntarget_metadata = Base.metadata')
    
    # Replace URL from config
    content = content.replace(
        'config.get_main_option("sqlalchemy.url")',
        'os.environ.get("DATABASE_URL")'
    )
    
    # Add os import if not present
    if 'import os' not in content:
        content = 'import os\n' + content
        
    # load dotenv
    content = 'from dotenv import load_dotenv\nload_dotenv()\n' + content
        
    with open(env_py_path, 'w') as f:
        f.write(content)
    print("Successfully configured alembic/env.py")
else:
    print(f"{env_py_path} not found.")
