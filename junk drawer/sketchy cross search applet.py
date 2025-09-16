import tkinter as tk
from tkinter import ttk
from tkhtmlview import HTMLLabel
from selenium import webdriver
from selenium.webdriver.edge.options import Options
import threading

# URLs for each store
store_urls = {
    'Walmart': 'https://www.walmart.com/search?q=',
    'Kroger': 'https://www.kroger.com/search?query=',
    'Meijer': 'https://www.meijer.com/shopping/search.html?text=',
    'Aldi': 'https://new.aldi.us/results?q=',
    'Publix': 'https://www.publix.com/search?searchTerm=',
    'Albertsons': 'https://www.albertsons.com/shop/search-results.html?q='
}

# Function to perform search and display results
def perform_search(search_term, stores):
    for store in stores:
        thread = threading.Thread(target=open_browser, args=(store, search_term))
        thread.start()

# Function to open browser and display result
def open_browser(store, search_term):
    options = Options()
    options.use_chromium = True
    options.headless = True
    driver = webdriver.Edge(options=options)

    url = store_urls[store] + search_term
    driver.get(url)
    page_source = driver.page_source

    result_label = HTMLLabel(root, html=page_source, width=800, height=600)
    result_label.pack()

    driver.quit()

# Create the main window
root = tk.Tk()
root.title("Store Comparison")
root.geometry("1200x800")

# Create search term input
search_term_label = ttk.Label(root, text="Search Term:")
search_term_label.pack(pady=5)
search_term_entry = ttk.Entry(root, width=50)
search_term_entry.pack(pady=5)

# Create store checkboxes
store_vars = {store: tk.BooleanVar() for store in store_urls}
for store in store_urls:
    checkbox = ttk.Checkbutton(root, text=store, variable=store_vars[store])
    checkbox.pack(anchor="w")

# Create search button
search_button = ttk.Button(root, text="Search", command=lambda: perform_search(search_term_entry.get(), [store for store in store_urls if store_vars[store].get()]))
search_button.pack(pady=20)

# Start the main event loop
root.mainloop()
