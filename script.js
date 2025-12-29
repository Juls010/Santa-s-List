const form = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const nameInput = form.querySelector('input[type="text"]');
const linkInput = form.querySelector('input[type="url"]');
const giftDescription = document.getElementById("giftDescription");
const giftPriority = document.getElementById("giftPriority");
let isEditing = false;  
let editingId = null;    
const submitBtn = form.querySelector("button"); 
const santaStatsPanel = document.getElementById("santa-stats");
const santaModeBtn = document.getElementById("santaModeBtn");
const originalBtnContent = submitBtn.innerHTML;
const welcomeModal = document.getElementById('welcomeModal');
const originalPlaceholder = giftDescription.placeholder; 




santaModeBtn.addEventListener("change", (e) => {
    if (e.target.checked) {
        document.body.classList.add("santa-mode");
        submitBtn.innerHTML = 'Add to list <i class="fa-solid fa-envelope-circle-check"></i>';
        giftDescription.placeholder = "Notes (Price, store, details...)";

        localStorage.setItem("santaMode", "true");

        if(typeof updateStats === "function") updateStats();

    } else {
        document.body.classList.remove("santa-mode");
        submitBtn.innerHTML = originalBtnContent;
        giftDescription.placeholder = originalPlaceholder;

        localStorage.setItem("santaMode", "false");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (typeof getGifts === "function") {
        getGifts().forEach(gift => createCard(gift));
    }

    const welcomeModal = document.getElementById("welcomeModal");
    const helpBtn = document.getElementById("helpBtn");
    const closeButtons = document.querySelectorAll(".close-trigger");

    const openModal = () => {
        if (welcomeModal) welcomeModal.classList.add('show');
    };

    const closeModal = () => {
        if (welcomeModal) welcomeModal.classList.remove('show');
        localStorage.setItem('santaTutorialSeen', 'true');
    };

    if (helpBtn) {
        helpBtn.addEventListener("click", openModal);
    }

    closeButtons.forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    window.addEventListener("click", (e) => {
        if (e.target === welcomeModal) {
            closeModal();
        }
    });

    const hasSeenTutorial = localStorage.getItem('santaTutorialSeen');
    if (!hasSeenTutorial) {
        setTimeout(openModal, 1000);
    }

    const santaModeBtn = document.getElementById("santaModeBtn");
    const isSantaMode = localStorage.getItem("santaMode") === "true";
    const submitBtn = document.querySelector(".todo-form button");
    const giftDescription = document.getElementById("giftDescription");

    let originalBtnContent = "";
    let originalPlaceholder = "";

    if (submitBtn) originalBtnContent = submitBtn.innerHTML;
    if (giftDescription) originalPlaceholder = giftDescription.placeholder;

    if (isSantaMode) {
        document.body.classList.add("santa-mode");
        if (santaModeBtn) santaModeBtn.checked = true;
        if(typeof updateStats === "function") updateStats();

        if (submitBtn) submitBtn.innerHTML = 'Add to list <i class="fa-solid fa-envelope-circle-check"></i>';
        if (giftDescription) giftDescription.placeholder = "Notes (Price, store, details...)";
    }

    if (santaModeBtn) {
        santaModeBtn.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.body.classList.add("santa-mode");
                localStorage.setItem("santaMode", "true");
                
                if (submitBtn) submitBtn.innerHTML = 'Add to list <i class="fa-solid fa-envelope-circle-check"></i>';
                if (giftDescription) giftDescription.placeholder = "Notes (Price, store, details...)";
                
                if(typeof updateStats === "function") updateStats();
            } else {
                document.body.classList.remove("santa-mode");
                localStorage.setItem("santaMode", "false");
                
                if (submitBtn) submitBtn.innerHTML = originalBtnContent;
                if (giftDescription) giftDescription.placeholder = originalPlaceholder;
            }
        });
    }

    if (typeof setupCustomSelect === "function") setupCustomSelect();
    if (typeof startCountdown === "function") startCountdown();
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

    if (isEditing) {
        const allCards = document.querySelectorAll(".todo-card");
        allCards.forEach(card => {
            if (card.querySelector(".card-title").textContent === editingId) {
                card.remove();
            }
        });

        if (typeof removeGift === "function") removeGift(editingId);
    }

    createCard(gift);
    if (typeof addGift === "function") addGift(gift);

    form.reset();
    resetCustomSelect(); 

    submitBtn.innerHTML = 'Add to list <i class="fa-solid fa-envelope-circle-check"></i>';

    isEditing = false;
    editingId = null;
    
    scrollToBottom();
});

function startCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");

    if (!daysEl || !hoursEl || !minutesEl) {
        console.log("Counter not found");
        return;
    }

    function updateTimer() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        let christmas = new Date(currentYear, 11, 25, 0, 0, 0);

        if (now > christmas) {
            christmas.setFullYear(currentYear + 1);
        }

        const diff = christmas - now;

        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor((diff / 1000 / 60 / 60) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);

        daysEl.innerText = d < 10 ? "0" + d : d;
        hoursEl.innerText = h < 10 ? "0" + h : h;
        minutesEl.innerText = m < 10 ? "0" + m : m;
    }
    setInterval(updateTimer, 1000);
    updateTimer(); 
}

function createCard(gift) {
    const card = document.createElement("div");
    card.classList.add("todo-card");

    if (gift.bought) {
        card.classList.add("completed");
    }

    const priorityText = {
        low: "🎁 Low",
        medium: "⭐ Medium",
        high: "🌟 High"
    };

    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${gift.name}</h3>
            
            <div class="card-actions" style="display: flex; align-items: center;">
                <span class="status-label">Completed!</span>

                <button class="check-btn" title="Mark as bought">
                    <i class="fa-regular fa-square-check"></i>
                </button>

                <button class="edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>

        ${gift.description ? `<p class="card-description">${gift.description}</p>` : ""}
        ${gift.link ? `<a href="${gift.link}" class="card-link" target="_blank">View gift 🔗</a>` : ""}

        <div class="card-footer">
            <span class="card-priority">${priorityText[gift.priority] || gift.priority}</span>
        </div>
    `;

    const checkBtn = card.querySelector(".check-btn");
    checkBtn.addEventListener("click", () => {
        card.classList.toggle("completed");
        
        gift.bought = !gift.bought; 
    
        if (typeof toggleGiftBought === "function") {
            toggleGiftBought(gift.name);
        } else {
            saveAllGifts(); 
        }

        updateStats(); 
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
        card.remove();
        if (typeof removeGift === "function") removeGift(gift.name);
        updateStats(); 
    });
    
    card.querySelector(".edit-btn").addEventListener("click", () => {
        nameInput.value = gift.name;
        linkInput.value = gift.link;
        giftDescription.value = gift.description;
        setCustomSelectValue(gift.priority);
        isEditing = true;
        editingId = gift.name; 
        submitBtn.innerHTML = "Save changes";
        form.scrollIntoView({ behavior: "smooth" });
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

function setCustomSelectValue(value) {
    const selectOriginal = document.getElementById("giftPriority");
    const headboard = document.querySelector(".select-headboard");
    const options = document.querySelectorAll(".option");

    selectOriginal.value = value;

    let textToShow = "⭐ Medium"; 
    for (let opt of selectOriginal.options) {
        if (opt.value === value) textToShow = opt.text;
    }
    
    if(headboard) headboard.textContent = textToShow;
}

function resetCustomSelect() {
    const selectOriginal = document.getElementById("giftPriority");
    const headboard = document.querySelector(".select-headboard");
    
    selectOriginal.value = "medium"; 
    if(headboard) headboard.textContent = "⭐ Medium"; 
}

function updateStats() {
    const gifts = typeof getGifts === "function" ? getGifts() : [];
    
    const total = gifts.length;
    const bought = gifts.filter(g => g.bought).length;
    const highPriority = gifts.filter(g => g.priority === 'high' && !g.bought).length;

    document.getElementById("total-gifts").innerText = total;
    document.getElementById("total-bought").innerText = bought;
    document.getElementById("pending-high").innerText = highPriority;
}
