from duckduckgo_search import DDGS
import json

try:
    with DDGS() as ddgs:
        print("Searching for 'Java Developer' (no site filter)...")
        results = list(ddgs.text('Java Developer', max_results=5))
        print(f"Found {len(results)} results.")
        # print(json.dumps(results, indent=2))
except Exception as e:
    print(f"Error: {e}")
