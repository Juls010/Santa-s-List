const form = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const nameInput = form.querySelector('input[type="text"]');
const linkInput = form.querySelector('input[type="url"]');
const giftDescription = document.getElementById("giftDescription");
const giftPriority = document.getElementById("giftPriority");

document.addEventListener("DOMContentLoaded", () => {
    if (typeof getGifts === "function") {
        getGifts().forEach(gift => createCard(gift));
    }

    setupCustomSelect();
});

form.addEventListener("submit", e => {
    e.preventDefault();

    const gift = {
        name: nameInput.value.trim(),
        link: linkInput.value.trim(),
        description: giftDescription.value.trim(),
        priority: giftPriority.value
    };

    if (!gift.name) return;

    createCard(gift);
    if (typeof addGift === "function") addGift(gift);

    form.reset();
    resetCustomSelect();
    scrollToBottom();
});

function createCard(gift) {
    const card = document.createElement("div");
    card.classList.add("todo-card");

    const priorityText = {
        low: "🎁 Low",
        medium: "⭐ Medium",
        high: "🌟 High"
    };

    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${gift.name}</h3>
            <button class="delete-btn">✖</button>
        </div>

        ${gift.description ? `<p class="card-description">${gift.description}</p>` : ""}
        ${gift.link ? `<a href="${gift.link}" class="card-link" target="_blank">View gift 🔗</a>` : ""}

        <div class="card-footer">
            <span class="card-priority">${priorityText[gift.priority] || gift.priority}</span>
        </div>
    `;

    card.querySelector(".delete-btn").addEventListener("click", () => {
        card.remove();
        if (typeof removeGift === "function") removeGift(gift.name);
    });

    todoList.appendChild(card);
}

function scrollToBottom() {
    setTimeout(() => {
        todoList.scrollTo({
            top: todoList.scrollHeight, 
            behavior: 'smooth'       
        });
    }, 50);
}

function setupCustomSelect() {
    const selectOriginal = document.getElementById("giftPriority");
    
    selectOriginal.classList.add("hidden"); 

    const container = document.createElement("div");
    container.className = "custom-select";
    selectOriginal.parentNode.insertBefore(container, selectOriginal.nextSibling);

    const headboard = document.createElement("div");
    headboard.className = "select-headboard"; 
    headboard.textContent = selectOriginal.options[selectOriginal.selectedIndex].text;
    container.appendChild(headboard);

    const listOptions = document.createElement("div");
    listOptions.className = "select-options"; 
    
    for (let option of selectOriginal.options) {
        const item = document.createElement("div");
        item.className = "option"; 
        item.textContent = option.text;
        
        item.addEventListener("click", function() {
            headboard.textContent = option.text;
            selectOriginal.value = option.value;
            listOptions.classList.remove("view"); 
        });
        
        listOptions.appendChild(item);
    }
    
    container.appendChild(listOptions);

    headboard.addEventListener("click", function(e) {
        e.stopPropagation();
        listOptions.classList.toggle("view");
    });

    document.addEventListener("click", function(e) {
        if (!container.contains(e.target)) {
            listOptions.classList.remove("view"); 
        }
    });
}

function resetCustomSelect() {
    const selectOriginal = document.getElementById("giftPriority");
    const headboard = document.querySelector(".select-headboard");
    
    selectOriginal.value = "medium"; 
    if(headboard) headboard.textContent = "⭐ Medium"; 
}