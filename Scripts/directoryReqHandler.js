// directoryReqHandler.js for Pankiverse/HTML directory injection handling
// Copyright (c) 2024 llama-3.1-sonar-large-128k-online, GPT-4
document.addEventListener('DOMContentLoaded', function() {
    function createFileTree(data, parentElement) {
        if (!data || !data.children) {
            console.error("Data is undefined or not in the correct format, cannot create file tree");
            return;
        }
        const ul = document.createElement('ul');
        parentElement.appendChild(ul);
        data.children.forEach(item => {
            const li = document.createElement('li');
            if (item.type === 'file') {
                const a = document.createElement('a');
                a.href = item.path;
                a.textContent = item.name;
                li.appendChild(a);
                li.appendChild(document.createTextNode(` (${item.size} bytes)`));
            } else if (item.type === 'directory') {
                const span = document.createElement('span');
                span.textContent = item.name;
                li.appendChild(span);
                createFileTree(item, li);
            }
            ul.appendChild(li);
        });
    }

    function calculateTotals(data) {
        let totalBytes = 0;
        let fileCount = 0;
        let dirCount = 0;
        function traverse(items) {
            items.forEach(item => {
                if (item.type === 'file') {
                    totalBytes += item.size;
                    fileCount++;
                } else if (item.type === 'directory') {
                    dirCount++;
                    traverse(item.children);
                }
            });
        }
        traverse(data.children);
        const totalSpace = 391680654347;
        const freeSpace = totalSpace - totalBytes;
        return { totalBytes, fileCount, dirCount, freeSpace };
    }

    function updateCard(data) {
        const card = document.querySelector('.cardDir');
        if (!card) {
            console.error("Element with class 'cardDir' not found");
            return;
        }
        card.innerHTML = ''; // Clear existing content
        const h2 = document.createElement('h2');
        h2.textContent = 'Directory Listing';
        card.appendChild(h2);
        const volumeInfo = document.createElement('p');
        volumeInfo.className = 'prefix-suffix';
        volumeInfo.textContent = 'Volume in drive C has no label. Volume Serial Number is 5EF3-DEEC';
        card.appendChild(volumeInfo);
        createFileTree(data, card);
        const { totalBytes, fileCount, dirCount, freeSpace } = calculateTotals(data);
        const fileSummary = document.createElement('p');
        fileSummary.className = 'prefix-suffix';
        fileSummary.textContent = `${fileCount} File(s) ${totalBytes.toLocaleString()} bytes`;
        card.appendChild(fileSummary);
        const dirSummary = document.createElement('p');
        dirSummary.className = 'prefix-suffix';
        dirSummary.textContent = `${dirCount} Dir(s) ${freeSpace.toLocaleString()} bytes free`;
        card.appendChild(dirSummary);
    }

    fetch('directory_listing.html')
        .then(response => response.text())
        .then(data => {
            const card = document.querySelector('.cardDir');
            if (!card) {
                console.error("Element with class 'cardDir' not found");
                return;
            }
            card.innerHTML = data; // Inject the HTML content directly
        })
        .catch(error => console.error('Error loading directory tree:', error));
});
