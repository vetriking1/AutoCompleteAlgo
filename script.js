class Node {
    constructor() {
        this.children = {};
        this.wordEnd = false;
    }
}

class Trie {
    constructor() {
        this.rootNode = new Node();
        this.wordList = [];
    }

    insert(word) {
        let currNode = this.rootNode;
        for (let char of word) {
            if (!currNode.children[char]) {
                currNode.children[char] = new Node();
            }
            currNode = currNode.children[char];
        }
        currNode.wordEnd = true;
    }

    autoCompleteRec(node, prefix) {
        if (node.wordEnd) {
            this.wordList.push(prefix);
        }
        for (let char in node.children) {
            this.autoCompleteRec(node.children[char], prefix + char);
        }
    }

    autoComplete(prefix) {
        let currNode = this.rootNode;
        for (let char of prefix) {
            if (!currNode.children[char]) {
                return [];
            }
            currNode = currNode.children[char];
        }
        this.wordList = [];
        this.autoCompleteRec(currNode, prefix);
        return this.wordList;
    }
}

// Example usage:
const trie = new Trie();

const wordContainer = document.getElementById('wordContainer');

// Load words from the text file
fetch(wordContainer.dataset.file)
  .then(response => response.text())
  .then(text => {
    const words = text.split('\n').filter(word => word.trim() !== '');
    words.forEach(word => trie.insert(word.toLowerCase()));
  })
  .catch(error => console.error('Error loading words:', error));

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("ib");
    const suggestionsList = document.getElementById("suggestions");

    input.oninput = () => {
        const inputValue = input.value;
        const suggestions = trie.autoComplete(inputValue);
        suggestionsList.innerHTML = "";

        let i = 0
        suggestions.slice(1,10).forEach(suggestion => {
            const li = document.createElement("li");
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
            li.addEventListener("click", () => {
                input.value = suggestion;
                suggestionsList.innerHTML = "";
            });
        });
        if (input.value == "")
            suggestionsList.innerHTML = ""
    };
});
