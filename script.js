// Force page to load at the top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- PRELOADER HANDLING ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait for fonts to be ready too
        document.fonts.ready.then(() => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 600); // Small extra buffer for smoothness
        });
    }
});

// Initialize Lucide Icons
lucide.createIcons();
// Prevent the loader icon from being re-processed by future createIcons() calls
const loaderIcon = document.querySelector('.loader-icon');
if (loaderIcon) loaderIcon.removeAttribute('data-lucide');

// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://qhgmjekyyxerrjlkrogp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ21qZWt5eXhlcnJqbGtyb2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjgyOTUsImV4cCI6MjA5MTM0NDI5NX0.M2IejAthgbToG-c2nfCD78V47j2KGOcQvg0rmrpFFGc';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DATA SYSTEM ---

const DEFAULT_DATA = {
    calendar: [
        { id: 1, date: "March 6", title: "First Meeting", description: "The science field club launched successfully with our introductory meeting!", type: "meeting" },
        { id: 2, date: "March 13", title: "OMSI Prep Meeting", description: "We reviewed our goals and prepared for the Trip Teams roles at OMSI.", type: "meeting" },
        { id: 3, date: "March 20", title: "OMSI Deadline", description: "Permission slips and payments were due for the OMSI trip.", type: "deadline" },
        { id: 4, date: "April 3", title: "OMSI Trip", description: "We had an amazing trip to the Oregon Museum of Science and Industry.", type: "trip", links: [{ name: "VIEW OMSI SLIDES", url: "https://docs.google.com/presentation/d/1hOb-dfVeICpN3nH9uDsAseyEgZs8CTmS5dgkLcA0sn8/edit?usp=sharing" }] },
        { id: 5, date: "April 9", title: "OMSI Review & Zoo Prep", description: "Reviewing our OMSI findings and going over details for the upcoming Oregon Zoo trip.", type: "meeting" },
        { id: 6, date: "April 14", title: "Oregon Zoo Deadline", description: "Permission slip and $13 fee are due to Deanna Lowe!", type: "deadline", links: [{ name: "PERMISSION SLIP", url: "https://docs.google.com/document/d/1siziM1CW5AM2ErR5PTPls2JXVZ1HWuki/edit?usp=sharing" }] },
        { id: 7, date: "April 29", title: "Oregon Zoo Trip", description: "Get ready for our zoo trip! Departure is at 9:30 AM.", type: "trip" },
        { id: 8, date: "May 5", title: "Zoo Review & Topgolf Prep", description: "Reviewing what we learned at the Zoo and preparing for the physics of Topgolf.", type: "meeting" },
        { id: 9, date: "May 11", title: "Topgolf Deadline", description: "Permission slip and $12 fee are due!", type: "deadline", links: [{ name: "PERMISSION SLIP", url: "https://docs.google.com/document/d/1fztRUHK0FGga5l6RD6i6Z7IjZDycQoM5/edit?usp=sharing" }] },
        { id: 10, date: "May 19", title: "Topgolf Trip", description: "Time to experience the physics of golf! Let's hit the range.", type: "trip" },
        { id: 11, date: "May 22", title: "Topgolf Review & Final Meeting", description: "Our final meeting to wrap up the year. Present your group slides!", type: "meeting" }
    ],
    resources: [
        {
            id: 1,
            title: "Club Member List",
            description: "Current roster of all Science Field Club members.",
            icon: "users",
            links: [{ name: "View Roster", url: "https://docs.google.com/spreadsheets/d/1zW3jt0BTC-vJHBtmn07ziwwamYmfXPxmkOSA_oIOhTA/edit?usp=sharing" }]
        },
        {
            id: 2,
            title: "Trip Team Slides",
            description: "View the presentations put together by our Trip Teams!",
            icon: "monitor",
            links: [{ name: "OMSI Slides", url: "https://docs.google.com/presentation/d/1hOb-dfVeICpN3nH9uDsAseyEgZs8CTmS5dgkLcA0sn8/edit?usp=sharing" }]
        },
        {
            id: 3,
            title: "Permission Forms",
            description: "Quick access to all upcoming field trip permission slips.",
            icon: "file-check-2",
            links: [
                { name: "Oregon Zoo Form", url: "https://docs.google.com/document/d/1siziM1CW5AM2ErR5PTPls2JXVZ1HWuki/edit?usp=sharing" },
                { name: "Topgolf Form", url: "https://docs.google.com/document/d/1fztRUHK0FGga5l6RD6i6Z7IjZDycQoM5/edit?usp=sharing" },
                { name: "OMSI Form", url: "https://docs.google.com/document/d/1MvUqUvjK4iwdIUYODilcxSaISkjasMLD/edit?usp=sharing" }
            ]
        }
    ],
    adminDocs: [
        { id: 1, name: "25/26 Member List (w/ Contact Info)", url: "https://docs.google.com/spreadsheets/d/1IVa2kDnZgd3FvAihiq3o_8HXEQHX8zNF1kk8WS2AfGI/edit?usp=sharing" },
        { id: 2, name: "25/26 Zoo Eligibility", url: "https://docs.google.com/spreadsheets/d/1V8GmkQCR9dK3hicUBojXClzEYr6iY4GZRPq3CYz2cS4/edit?gid=0" },
        { id: 3, name: "25/26 OMSI Eligibility", url: "https://docs.google.com/spreadsheets/d/1x4nYfHSyEVncc-Pl9QeI8Ub6Vk3gn52krrNkFbp7rMo/edit?gid=0" },
        { id: 4, name: "25/26 Topgolf Eligibility", url: "https://docs.google.com/spreadsheets/d/1YcUw8coFzPFLBy7r7p3QSIaONOyrNsvKdI9gtTszOyQ/edit?usp=sharing" },
        { id: 5, name: "Expenses Tracking", url: "https://docs.google.com/spreadsheets/d/1jhIEYxW09a9kDlt2S4PrBPAP2hH7jAmQuL34EnmutGw/edit?usp=sharing" },
        { id: 6, name: "Interest Form", url: "https://docs.google.com/spreadsheets/d/1V0ejIHqxnYef7ZuEUBtLGhOsGIRugQqofQxuG4O_Hto/edit?usp=sharing" },
        { id: 7, name: "First Meeting Presentation", url: "https://docs.google.com/presentation/d/12s84I5A0ZbOhKiAsgYjnBPCSwG3t_KbAwZck4Lv3Uts/edit?usp=sharing" },
        { id: 8, name: "Interest Meeting Presentation", url: "https://docs.google.com/presentation/d/13x1XAR4pWUyfpC36oilV68Znv3xxHawhGjjU99IzLYU/edit?usp=sharing" }
    ]
};

// INITIALIZE WITH LOCAL DATA IMMEDIATELY
let appData = JSON.parse(localStorage.getItem('sf_club_data')) || JSON.parse(JSON.stringify(DEFAULT_DATA));

async function loadDataAndSync() {
    try {
        const [cal, res, docs] = await Promise.all([
            supabaseClient.from('calendar').select('*').order('id', { ascending: true }),
            supabaseClient.from('resources').select('*').order('id', { ascending: true }),
            supabaseClient.from('admin_docs').select('*').order('id', { ascending: true })
        ]);

        const hasCloudData = (cal.data?.length > 0 || res.data?.length > 0 || docs.data?.length > 0);

        if (hasCloudData) {
            // We use cloud data, but we de-duplicate and SORT it!
            appData.calendar = deduplicate(cal.data || [], 'title').sort((a, b) => {
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return dateA - dateB;
            });
            appData.resources = deduplicate(res.data || [], 'title');
            
            // Preserve our local ordering for admin docs if it exists
            const fetchedDocs = deduplicate(docs.data || [], 'name');
            const savedData = JSON.parse(localStorage.getItem('sf_club_data'));
            if (savedData && savedData.adminDocs) {
                const savedOrder = savedData.adminDocs.map(d => d.id);
                appData.adminDocs = fetchedDocs.sort((a, b) => {
                    let indexA = savedOrder.indexOf(a.id);
                    let indexB = savedOrder.indexOf(b.id);
                    if (indexA === -1) indexA = 9999;
                    if (indexB === -1) indexB = 9999;
                    return indexA - indexB;
                });
            } else {
                appData.adminDocs = fetchedDocs;
            }

            // Save our clean, sorted copy back to local storage
            localStorage.setItem('sf_club_data', JSON.stringify(appData));
        } else {
            console.log("Cloud is empty. Migrating your local data to cloud...");
            await migrateToCloud(appData);
        }

        renderAll();
    } catch (err) {
        console.warn("Supabase sync pending or failed. Using local data.");
        renderAll();
    }
}

function deduplicate(arr, key) {
    const seen = new Set();
    return arr.filter(item => {
        const val = item[key] + (item.date || '');
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
}

async function migrateToCloud(data) {
    const calToSeed = (data.calendar || []).map(({ id, ...rest }) => rest);
    const resToSeed = (data.resources || []).map(({ id, ...rest }) => rest);
    const docsToSeed = (data.adminDocs || []).map(({ id, ...rest }) => rest);

    if (calToSeed.length > 0) await supabaseClient.from('calendar').insert(calToSeed);
    if (resToSeed.length > 0) await supabaseClient.from('resources').insert(resToSeed);
    if (docsToSeed.length > 0) await supabaseClient.from('admin_docs').insert(docsToSeed);
}

// Initial render
renderAll();
// Sync in background
loadDataAndSync();

function saveData() {
    renderAll();
}

// --- RENDERING ---

function renderAll() {
    renderTimeline();
    renderStudentResources();
    renderAdminLists();
    updateTimelineHeader();
    if (window.lucide) lucide.createIcons();
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort events by date before rendering
    const sortedEvents = [...appData.calendar].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
        return dateA - dateB;
    });

    container.innerHTML = sortedEvents.map(event => {
        const eventDate = parseDate(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const isPast = eventDate < today;

        let tagClass = 'tag-info';
        let tagText = event.type || 'Meeting';

        if (isPast) {
            tagClass = 'tag-muted';
            tagText = 'Completed';
        } else if (event.type === 'deadline') {
            tagClass = 'tag-warning';
            tagText = 'Deadline';
        } else if (event.type === 'trip') {
            tagClass = 'tag-success';
            tagText = 'Field Trip';
        } else {
            tagText = capitalize(event.type || 'Meeting');
        }

        const linksHtml = (event.links || []).map(link =>
            `<a href="${link.url}" target="_blank" class="read-more">${link.name.toUpperCase()} ▸</a>`
        ).join('');

        return `
            <div class="timeline-item ${isPast ? 'past-event' : ''}">
                <div class="timeline-date">${formatDateForDisplay(event.date)}</div>
                <div class="timeline-content card-beige ${!isPast && eventDate.getTime() === today.getTime() ? 'highlight-content' : ''}">
                    <div class="event-tag ${tagClass}">${tagText}</div>
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    ${linksHtml}
                </div>
            </div>
        `;
    }).join('');
}

function formatDateForDisplay(dateStr) {
    if (!dateStr) return "";
    // If it's already "Month Day" and not ISO, return as is (for legacy)
    if (!dateStr.includes('-') && isNaN(Date.parse(dateStr + ", 2026"))) return dateStr;

    // Try to parse it
    const date = parseDate(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function parseDate(dateStr) {
    if (!dateStr) return new Date();
    if (dateStr.includes('-')) {
        // Many browsers handle YYYY-MM-DD as UTC, we want local
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    const year = new Date().getFullYear();
    return new Date(`${dateStr}, ${year}`);
}

function renderStudentResources() {
    const container = document.getElementById('resources-container');
    if (!container) return;

    container.innerHTML = appData.resources.map(res => {
        const linksHtml = (res.links || []).map(link =>
            `<a href="${link.url}" target="_blank">${link.name}</a>`
        ).join('');

        return `
            <div class="resource-card card card-white">
                <i data-lucide="${res.icon || 'link'}" class="resource-icon"></i>
                <h4>${res.title}</h4>
                <p>${res.description}</p>
                <div class="resource-links">
                    ${linksHtml}
                </div>
            </div>
        `;
    }).join('');
}

function renderAdminLists() {
    // Admin Docs List
    const docsList = document.getElementById('admin-docs-list');
    if (docsList) {
        docsList.innerHTML = appData.adminDocs.map(doc => `
            <div class="manage-item card-item" data-id="${doc.id}">
                <div class="drag-handle" style="cursor: grab; margin-right: 0.5rem; color: var(--text-muted);">
                    <i data-lucide="grip-vertical"></i>
                </div>
                <div class="item-info" style="flex: 1;">
                    <strong style="color: var(--primary);">${doc.name}</strong>
                    <span>${doc.url}</span>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick="editDoc(${doc.id})"><i data-lucide="edit-3"></i></button>
                    <button class="icon-btn danger" onclick="deleteDoc(${doc.id})"><i data-lucide="trash-2"></i></button>
                    <a href="${doc.url}" target="_blank" class="icon-btn"><i data-lucide="external-link"></i></a>
                </div>
            </div>
        `).join('');

        // Initialize SortableJS for drag-and-drop
        if (window.Sortable) {
            if (docsList._sortable) {
                docsList._sortable.destroy();
            }
            // Using the modal content container for scrolling context
            const modalContent = document.querySelector('.admin-modal-content');
            
            docsList._sortable = Sortable.create(docsList, {
                handle: '.drag-handle',
                animation: 250,
                easing: "cubic-bezier(0.25, 1, 0.5, 1)",
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                scroll: modalContent, // Explicitly constrain scroll to the modal
                forceAutoScrollFallback: true,
                scrollSensitivity: 100, // Distance in px to edge to start scrolling
                scrollSpeed: 20, // Speed of scroll
                bubbleScroll: false, // Prevent background window scrolling
                onEnd: async function (evt) {
                    const newOrderIds = Array.from(docsList.children).map(child => parseInt(child.getAttribute('data-id')));
                    
                    // Update appData.adminDocs locally based on new order
                    const newAdminDocs = [];
                    newOrderIds.forEach(id => {
                        const doc = appData.adminDocs.find(d => d.id === id);
                        if (doc) newAdminDocs.push(doc);
                    });
                    appData.adminDocs = newAdminDocs;
                    localStorage.setItem('sf_club_data', JSON.stringify(appData));
                    
                    // Attempt to sync the new order to supabase.
                    // We'll update an 'order_index' or just swap values if needed.
                    try {
                        for (let i = 0; i < appData.adminDocs.length; i++) {
                            await supabaseClient.from('admin_docs').update({ id: appData.adminDocs[i].id }).eq('id', appData.adminDocs[i].id); // Just a dummy update for now
                        }
                    } catch (err) {
                        console.warn("Order not saved to cloud yet due to missing column.", err);
                    }
                }
            });
        }
    }

    // Admin Resources List
    const resourceList = document.getElementById('admin-resources-list');
    if (resourceList) {
        resourceList.innerHTML = appData.resources.map(res => `
            <div class="manage-item card-item">
                <div class="item-info">
                    <strong style="color: var(--primary);">${res.title}</strong>
                    <span style="font-size: 0.85rem; opacity: 0.8;">${res.description}</span>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick="editResource(${res.id})"><i data-lucide="edit-3"></i></button>
                </div>
            </div>
        `).join('');
    }

    // Admin Calendar List
    const calList = document.getElementById('admin-calendar-list');
    if (calList) {
        calList.innerHTML = appData.calendar.map(event => `
            <div class="manage-item card-item">
                <div class="item-info">
                    <strong style="color: var(--primary);">${event.title}</strong>
                    <div class="item-meta">${formatDateForDisplay(event.date)} • ${capitalize(event.type)}</div>
                    <span style="font-size: 0.85rem; opacity: 0.8; margin-top: 0.25rem;">${event.description}</span>
                </div>
                <div class="item-actions">
                    <button class="icon-btn" onclick="editEvent(${event.id})"><i data-lucide="edit-3"></i></button>
                    <button class="icon-btn danger" onclick="deleteEvent(${event.id})"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
        `).join('');
    }
}

function updateTimelineHeader() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const currentYear = today.getFullYear();

    let todaysEvents = [];
    let tomorrowsEvents = [];
    let nextEvent = null;

    appData.calendar.forEach(event => {
        const eventDate = parseDate(event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate.getTime() === today.getTime()) {
            todaysEvents.push(event.title);
        } else if (eventDate.getTime() === tomorrow.getTime()) {
            tomorrowsEvents.push(event.title);
        } else if (eventDate > today && !nextEvent) {
            nextEvent = event;
        }
    });

    let bannerMsg = "";
    if (todaysEvents.length > 0) {
        bannerMsg = `<strong>Event Today:</strong> Don't forget about the <strong>${todaysEvents.join(' & ')}</strong>!`;
    } else if (tomorrowsEvents.length > 0) {
        bannerMsg = `<strong>Event Tomorrow:</strong> Get ready for the <strong>${tomorrowsEvents.join(' & ')}</strong>!`;
    } else if (nextEvent) {
        bannerMsg = `<strong>Next Event:</strong> ${nextEvent.date} - ${nextEvent.title}`;
    }

    if (bannerMsg) {
        const topBar = document.querySelector('.top-bar');
        const topBarContainer = topBar ? topBar.querySelector('.container') : null;
        if (topBarContainer) {
            topBarContainer.innerHTML = `<span><i data-lucide="bell" style="width: 16px; height: 16px; margin-right: 6px; position: relative; top: 3px; display: inline-block;"></i> ${bannerMsg}</span>`;
            if (todaysEvents.length > 0) {
                topBar.classList.add('urgent');
            } else {
                topBar.classList.remove('urgent');
            }
            if (window.lucide) window.lucide.createIcons();
        }
    }
}

// --- UI LOGIC ---

// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const headerWrapper = document.querySelector('.sticky-header-wrapper');
let isScrolled = false;
let isNavigating = false;
let navigationTimeout;

function updateHeader() {
    const shouldScroll = isNavigating || window.scrollY > 50 || (navLinks && navLinks.classList.contains('active'));
    if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        if (isScrolled) {
            headerWrapper.classList.add('scrolled');
        } else {
            headerWrapper.classList.remove('scrolled');
        }
    }
}

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        updateHeader();
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');

        // Lock header in scrolled state during smooth scroll to prevent jumping
        isNavigating = true;
        updateHeader();

        clearTimeout(navigationTimeout);
        navigationTimeout = setTimeout(() => {
            isNavigating = false;
            updateHeader();
        }, 800);
    });
});

// --- SCROLL EFFECTS ---

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateHeader);
}, { passive: true });

// Admin Modal Logic
function openAdmin() {
    document.getElementById("admin-modal").classList.add("show");
    document.body.classList.add("modal-open");
    document.getElementById("admin-pwd").value = '';
    document.getElementById("admin-pwd").type = 'password';
    document.getElementById("admin-error").style.display = "none";
    const icon = document.getElementById("pwd-toggle-icon");
    if (icon) {
        icon.setAttribute("data-lucide", "eye");
        if (window.lucide) lucide.createIcons();
    }

    const modalContent = document.querySelector('.admin-modal-content');
    if (modalContent) modalContent.classList.add('compact');

    // Check if already logged in (simulated for session)
    if (sessionStorage.getItem('is_logged_in') === 'true') {
        showDashboard();
    } else {
        document.getElementById("admin-login-screen").style.display = "block";
        document.getElementById("admin-dashboard").style.display = "none";
        // Focus the password box
        setTimeout(() => {
            const pwdInput = document.getElementById("admin-pwd");
            if (pwdInput) pwdInput.focus();
        }, 300); // Small delay for modal animation
    }
}

function closeAdmin() {
    document.getElementById("admin-modal").classList.remove("show");
    document.body.classList.remove("modal-open");
}

function handleLoginKey(event) {
    if (event.key === "Enter") {
        checkAdminLogin();
    }
}

function checkAdminLogin() {
    const pwdInput = document.getElementById("admin-pwd").value;
    const errorMsg = document.getElementById("admin-error");

    if (pwdInput === "SenorIsCool5") {
        sessionStorage.setItem('is_logged_in', 'true');
        showDashboard();
    } else {
        errorMsg.style.display = "block";
    }
}

function togglePasswordVisibility() {
    const pwdInput = document.getElementById("admin-pwd");
    const icon = document.getElementById("pwd-toggle-icon");

    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        icon.setAttribute("data-lucide", "eye-off");
    } else {
        pwdInput.type = "password";
        icon.setAttribute("data-lucide", "eye");
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

function showDashboard() {
    const modalContent = document.querySelector('.admin-modal-content');
    if (modalContent) modalContent.classList.remove('compact');

    document.getElementById("admin-login-screen").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "block";
    renderAdminLists();
    if (window.lucide) lucide.createIcons();
}

function logoutAdmin() {
    sessionStorage.removeItem('is_logged_in');
    document.getElementById("admin-login-screen").style.display = "block";
    document.getElementById("admin-dashboard").style.display = "none";
}

window.switchTab = function (tabId) {
    const modalContent = document.querySelector('.admin-modal-content');
    const dashboard = document.getElementById('admin-dashboard');
    if (!modalContent || !dashboard) return;

    // Capture current modal height
    const oldHeight = modalContent.offsetHeight;
    modalContent.style.transition = 'none';
    modalContent.style.height = oldHeight + 'px';
    modalContent.style.overflow = 'hidden';

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId));
    });

    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('show', content.id === tabId);
    });

    // Force icon generation so new height is accurate
    if (window.lucide) lucide.createIcons();

    // Use two frames to ensure the collapse/growth is captured
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Measure the NEW height required by the modal-content
            // We set height to auto briefly to measure, then back
            modalContent.style.height = 'auto';
            const newHeight = modalContent.offsetHeight;
            modalContent.style.height = oldHeight + 'px';

            // Trigger reflow
            void modalContent.offsetHeight;

            // Animate
            modalContent.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            modalContent.style.height = newHeight + 'px';

            // Cleanup after animation
            setTimeout(() => {
                modalContent.style.height = 'auto';
                modalContent.style.overflow = 'auto'; // Restore scroll if needed
            }, 450);
        });
    });
}

// Close modal if clicked outside of content
window.onclick = function (event) {
    const modal = document.getElementById('admin-modal');
    const fModal = document.getElementById('form-modal');
    if (event.target == modal) closeAdmin();
    if (event.target == fModal) closeFormModal();
}

// Copy email
function copyEmail(email, element) {
    navigator.clipboard.writeText(email).then(() => {
        const span = element.querySelector('span');
        const originalText = span.innerText;
        span.innerText = "Copied!";
        element.style.color = "#16a34a";
        setTimeout(() => {
            span.innerText = originalText;
            element.style.color = "";
        }, 2000);
    });
}

// --- FORM HANDLING ---

let currentEditType = null;
let currentEditId = null;

function openFormModal(title, fields) {
    document.getElementById('form-title').innerText = title;
    document.getElementById('form-fields').innerHTML = fields;
    document.getElementById('form-modal').classList.add('show');
    document.body.classList.add('modal-open');
    // Set button text based on add vs edit
    const submitBtn = document.getElementById('form-submit-btn');
    if (submitBtn) {
        submitBtn.textContent = currentEditId ? 'Save Changes' : 'Add';
    }
    if (window.lucide) lucide.createIcons();
}

function closeFormModal() {
    document.getElementById('form-modal').classList.remove('show');
    // Only remove modal-open if the other modal isn't open
    if (!document.getElementById('admin-modal').classList.contains('show')) {
        document.body.classList.remove('modal-open');
    }
    currentEditId = null;
    currentEditType = null;
}

window.handleFormSubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        let error;
        if (currentEditType === 'adminDoc') {
            const doc = { name: data.name, url: data.url };
            if (currentEditId) {
                const res = await supabaseClient.from('admin_docs').update(doc).eq('id', currentEditId);
                error = res.error;
            } else {
                const res = await supabaseClient.from('admin_docs').insert(doc);
                error = res.error;
            }
        } else if (currentEditType === 'calendar') {
            const links = [];
            if (data.linkName && data.linkUrl) {
                links.push({ name: data.linkName, url: data.linkUrl });
            }
            const event = {
                date: data.date,
                title: data.title,
                description: data.description,
                type: data.type,
                links: links
            };
            if (currentEditId) {
                const res = await supabaseClient.from('calendar').update(event).eq('id', currentEditId);
                error = res.error;
            } else {
                const res = await supabaseClient.from('calendar').insert(event);
                error = res.error;
            }
        } else if (currentEditType === 'resource') {
            const linkNames = document.querySelectorAll('input[name="linkName[]"]');
            const linkUrls = document.querySelectorAll('input[name="linkUrl[]"]');
            const links = [];

            for (let i = 0; i < linkNames.length; i++) {
                if (linkNames[i].value && linkUrls[i].value) {
                    links.push({ name: linkNames[i].value, url: linkUrls[i].value });
                }
            }

            const resource = { title: data.title, description: data.description, icon: data.icon, links: links };
            if (currentEditId) {
                const res = await supabaseClient.from('resources').update(resource).eq('id', currentEditId);
                error = res.error;
            } else {
                const res = await supabaseClient.from('resources').insert(resource);
                error = res.error;
            }
        }

        if (error) throw error;

        await loadDataAndSync();
        closeFormModal();
        // Removed success alert as requested
    } catch (err) {
        console.error("Supabase Error:", err);
        alert("Failed to save: " + (err.message || "Unknown error"));
    }
}

// DOCS
window.showAddDocForm = function () {
    currentEditType = 'adminDoc';
    openFormModal('Add Internal Document', `
        <div class="form-group">
            <label>Link Name</label>
            <input type="text" name="name" class="form-control" required placeholder="e.g. 25/26 Member List">
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>Google Drive / Sheet URL</label>
            <input type="url" name="url" class="form-control" required placeholder="https://docs.google.com/...">
        </div>
    `);
}

window.editDoc = function (id) {
    const doc = appData.adminDocs.find(d => d.id === id);
    currentEditType = 'adminDoc';
    currentEditId = id;
    openFormModal('Edit Internal Link', `
        <div class="form-group">
            <label>Link Name</label>
            <input type="text" name="name" value="${doc.name}" class="form-control" required>
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>URL</label>
            <input type="url" name="url" value="${doc.url}" class="form-control" required>
        </div>
    `);
}

window.deleteDoc = async function (id) {
    if (confirm('Are you sure you want to remove this link?')) {
        try {
            await supabaseClient.from('admin_docs').delete().eq('id', id);
            await loadDataAndSync();
        } catch (err) {
            console.error("Error deleting doc:", err);
        }
    }
}

// CALENDAR
window.showAddEventForm = function () {
    currentEditType = 'calendar';
    openFormModal('Add Calendar Event', getEventFields());
}

window.editEvent = function (id) {
    const event = appData.calendar.find(e => e.id === id);
    currentEditType = 'calendar';
    currentEditId = id;
    openFormModal('Edit Event', getEventFields(event));
}

window.deleteEvent = async function (id) {
    if (confirm('Remove this event?')) {
        try {
            await supabaseClient.from('calendar').delete().eq('id', id);
            await loadDataAndSync();
        } catch (err) {
            console.error("Error deleting event:", err);
        }
    }
}

function getEventFields(data = {}) {
    const link = (data.links && data.links[0]) || {};

    let dateValue = data.date || '';
    // Normalize for date picker (must be YYYY-MM-DD)
    if (dateValue && !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        const d = parseDate(dateValue);
        if (!isNaN(d.getTime())) {
            // Format to YYYY-MM-DD for input
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            dateValue = `${y}-${m}-${day}`;
        }
    }

    return `
        <div class="grid-2" style="gap:1rem">
            <div class="form-group">
                <label>Event Date</label>
                <div class="date-input-wrapper" onclick="this.querySelector('input').showPicker()">
                    <i data-lucide="calendar" class="date-input-icon"></i>
                    <input type="date" name="date" value="${dateValue}" class="form-control" required>
                </div>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="type" class="form-control">
                    <option value="meeting" ${data.type === 'meeting' ? 'selected' : ''}>Meeting</option>
                    <option value="trip" ${data.type === 'trip' ? 'selected' : ''}>Field Trip</option>
                    <option value="deadline" ${data.type === 'deadline' ? 'selected' : ''}>Deadline</option>
                </select>
            </div>
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>Title</label>
            <input type="text" name="title" value="${data.title || ''}" class="form-control" required placeholder="Event Title">
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>Description</label>
            <textarea name="description" class="form-control" rows="3" required>${data.description || ''}</textarea>
        </div>
        <div class="grid-2" style="gap:1rem; margin-top:1rem">
            <div class="form-group">
                <label>Link Name (Optional)</label>
                <input type="text" name="linkName" value="${link.name || ''}" class="form-control" placeholder="PERMISSION SLIP">
            </div>
            <div class="form-group">
                <label>Link URL (Optional)</label>
                <input type="url" name="linkUrl" value="${link.url || ''}" class="form-control" placeholder="https://...">
            </div>
        </div>
    `;
}

// RESOURCES

window.editResource = function (id) {
    const res = appData.resources.find(r => r.id === id);
    currentEditType = 'resource';
    currentEditId = id;
    openFormModal('Edit Resource Card', getResourceFields(res));
}


function getResourceFields(data = {}) {
    const links = data.links || [];

    let metaHtml = `
        <div class="form-group">
            <label>Card Title</label>
            <input type="text" name="title" value="${data.title || ''}" class="form-control" required placeholder="e.g. Club Member List">
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>Description</label>
            <input type="text" name="description" value="${data.description || ''}" class="form-control" required>
        </div>
        <input type="hidden" name="icon" value="${data.icon || 'link'}">
    `;

    const linksHtml = links.map((link, i) => getLinkRowHtml(link.name, link.url)).join('');

    return `
        ${metaHtml}
        <div class="section-manage-header" style="margin-top: 1rem;">
            <label style="font-weight:700;">Links</label>
            <button type="button" class="btn btn-sm btn-outline-navy" onclick="addLinkRow()"><i data-lucide="plus"></i> Add Link</button>
        </div>
        <div id="dynamic-links-container" style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${linksHtml}
            ${links.length === 0 ? getLinkRowHtml() : ''}
        </div>
    `;
}

function getLinkRowHtml(name = '', url = '') {
    return `
        <div class="link-row" style="display: flex; gap: 0.5rem; align-items: center; animation: fadeIn 0.3s ease-out;">
            <input type="text" name="linkName[]" value="${name}" class="form-control" placeholder="Link Name" required style="flex: 1;">
            <input type="url" name="linkUrl[]" value="${url}" class="form-control" placeholder="URL" required style="flex: 2;">
            <button type="button" class="icon-btn danger" onclick="this.parentElement.remove()" style="width: 42px; height: 42px;"><i data-lucide="trash-2"></i></button>
        </div>
    `;
}

window.addLinkRow = function () {
    const container = document.getElementById('dynamic-links-container');
    const div = document.createElement('div');
    div.innerHTML = getLinkRowHtml();
    container.appendChild(div.firstElementChild);
    if (window.lucide) lucide.createIcons();
};

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initial Render
renderAll();
