import sys
import traceback

def smoke_test():
    print("Running startup smoke test...")
    try:
        from app.main import app
        print("✅ Successfully imported FastAPI app without errors.")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Failed to import FastAPI app. Startup crash detected:", file=sys.stderr)
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    smoke_test()
