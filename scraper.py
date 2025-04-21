import requests
from bs4 import BeautifulSoup
import os
import time

# Base URLs
base_url = "https://transcripts.foreverdreaming.org"
forum_url = f"{base_url}/viewforum.php?f=165"

headers = {
    "User-Agent": "Mozilla/5.0"
}

# Create output folder
os.makedirs("breaking_bad_transcripts", exist_ok=True)

# Step 1: Get all thread links from the forum
response = requests.get(forum_url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

threads = soup.select("a.topictitle")

print(f"Found {len(threads)} threads.")

for thread in threads:
    title_raw = thread.text.strip()
    title = title_raw.replace(" ", "_").replace(":", "").replace("?", "").replace("/", "-")
    href = thread['href'].split("&")[0]  # remove session ID if present
    thread_url = base_url + href

    print(f"Fetching: {title_raw}")
    thread_response = requests.get(thread_url, headers=headers)
    thread_soup = BeautifulSoup(thread_response.text, "html.parser")
    
    # Step 2: Extract the first post's transcript
    post_div = thread_soup.find("div", class_="postbody")
    if post_div:
        # Remove quote blocks and signatures
        for tag in post_div.select(".quote, .signature"):
            tag.decompose()

        # Extract clean text
        transcript = post_div.get_text(separator="\n", strip=True)

        # Save to file
        filename = f"breaking_bad_transcripts/{title}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(transcript)

        print(f"✅ Saved: {filename}")
    else:
        print(f"❌ Transcript not found for {title_raw}")

    time.sleep(1)  # Be nice to the server
