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
            title: "Member Essentials",
            description: "Current roster and bylaws of all Science Field Club members.",
            icon: "file-text",
            links: [{ name: "View Roster", url: "https://docs.google.com/spreadsheets/d/1zW3jt0BTC-vJHBtmn07ziwwamYmfXPxmkOSA_oIOhTA/edit?usp=sharing" }]
        },
        {
            id: 2,
            title: "Trip Team Slides",
            description: "Access the shared slide set for our trips. Add your slides here—please do not create separate files!",
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
    ],
    officers: [
        { id: 1, name: "Noah Allori", role: "President & Founder", email: "noaha2027@banks.k12.or.us", image: "images/noah.jpg", fallbackColor: "12284C", isAdvisor: false },
        { id: 2, name: "Finan Hailey", role: "Vice President", email: "finanh2028@banks.k12.or.us", image: "images/finan.jpg", fallbackColor: "12284C", isAdvisor: false },
        { id: 3, name: "Cassidy Acardi", role: "Secretary", email: "cassidya2027@banks.k12.or.us", image: "images/cassidy.jpg", fallbackColor: "12284C", isAdvisor: false },
        { id: 4, name: "Jane Bollmeier", role: "Fundraising Coordinator", email: "janeb2027@banks.k12.or.us", image: "images/jane.jpg", fallbackColor: "12284C", isAdvisor: false },
        { id: 5, name: "Dylan McDonald", role: "Treasurer", email: "dylanm2027@banks.k12.or.us", image: "images/dylan.jpg", fallbackColor: "12284C", isAdvisor: false },
        { id: 6, name: "Mark Anunsen", role: "Media Coordinator", email: "marka2027@banks.k12.or.us", image: "images/mark.jpg", fallbackColor: "12284C", isAdvisor: false },
        { id: 7, name: "Mr. Richeson", role: "Faculty Advisor", email: "tonyr@banks.k12.or.us", image: "images/richeson.webp", fallbackColor: "EADDca", isAdvisor: true }
    ]
};

// INITIALIZE WITH LOCAL DATA IMMEDIATELY
let appData = JSON.parse(localStorage.getItem('sf_club_data')) || JSON.parse(JSON.stringify(DEFAULT_DATA));

async function loadDataAndSync() {
    try {
        const [cal, res, docs, subs] = await Promise.all([
            supabaseClient.from('calendar').select('*').order('id', { ascending: true }),
            supabaseClient.from('resources').select('*').order('id', { ascending: true }),
            supabaseClient.from('admin_docs').select('*').order('id', { ascending: true }),
            supabaseClient.from('subscribers').select('*').order('id', { ascending: false })
        ]);

        const hasCloudData = (cal.data?.length > 0 || res.data?.length > 0 || docs.data?.length > 0);

        if (hasCloudData) {
            // 1. EXTRACT HIDDEN STATE (This allows cross-device sync without new tables)
            const stateRow = docs.data?.find(d => d.name === '_INTERNAL_STATE_');
            let cloudState = {};
            if (stateRow) {
                try {
                    // The "url" field is used as a JSON storage blob
                    cloudState = JSON.parse(stateRow.url);
                } catch (e) { console.warn("State row corrupted", e); }
            }

            // 2. PROCESS CALENDAR
            appData.calendar = deduplicate(cal.data || [], 'title').sort((a, b) => {
                return parseDate(a.date) - parseDate(b.date);
            });
            if (appData.calendar.length < (cal.data || []).length) {
                dbHeal('calendar', cal.data || [], 'title');
            }

            // 3. PROCESS RESOURCES
            appData.resources = deduplicate(res.data || [], 'title');
            if (appData.resources.length < (res.data || []).length) {
                dbHeal('resources', res.data || [], 'title');
            }

            // 4. PROCESS DOCS (Filter out the hidden state row)
            const fetchedDocs = (docs.data || []).filter(d => d.name !== '_INTERNAL_STATE_');
            const uniqueDocs = deduplicate(fetchedDocs, 'name');
            if (uniqueDocs.length < fetchedDocs.length) {
                dbHeal('admin_docs', fetchedDocs, 'name');
            }
            const savedOrder = cloudState.adminDocsOrder || (JSON.parse(localStorage.getItem('sf_club_data'))?.adminDocsOrder);

            if (savedOrder) {
                appData.adminDocs = uniqueDocs.sort((a, b) => {
                    let indexA = savedOrder.indexOf(a.id);
                    let indexB = savedOrder.indexOf(b.id);
                    if (indexA === -1) indexA = 9999;
                    if (indexB === -1) indexB = 9999;
                    return indexA - indexB;
                });
                appData.adminDocsOrder = savedOrder;
            } else {
                appData.adminDocs = uniqueDocs;
            }

            // 5. PROCESS SUBSCRIBERS
            // Priority: Real table -> Cloud State Row -> Local Storage
            if (!subs.error && subs.data?.length > 0) {
                appData.subscribers = subs.data;
            } else if (cloudState.subscribers) {
                appData.subscribers = cloudState.subscribers;
            } else {
                const savedData = JSON.parse(localStorage.getItem('sf_club_data'));
                if (savedData?.subscribers) appData.subscribers = savedData.subscribers;
            }

            // 6. PROCESS OFFICERS
            if (cloudState.officers) {
                appData.officers = cloudState.officers;
            } else {
                const savedData = JSON.parse(localStorage.getItem('sf_club_data'));
                if (savedData?.officers) appData.officers = savedData.officers;
            }
            const savedOfficersOrder = cloudState.officersOrder || (JSON.parse(localStorage.getItem('sf_club_data'))?.officersOrder);
            if (savedOfficersOrder && appData.officers) {
                appData.officers = appData.officers.sort((a, b) => {
                    let indexA = savedOfficersOrder.indexOf(a.id);
                    let indexB = savedOfficersOrder.indexOf(b.id);
                    if (indexA === -1) indexA = 9999;
                    if (indexB === -1) indexB = 9999;
                    return indexA - indexB;
                });
                appData.officersOrder = savedOfficersOrder;
            }

            localStorage.setItem('sf_club_data', JSON.stringify(appData));
        } else {
            console.log("Cloud is empty. Migrating your local data...");
            await migrateToCloud(appData);
        }

        renderAll();
    } catch (err) {
        console.warn("Supabase sync issue. Using local data fallback.", err);
        renderAll();
    }
}

async function saveGlobalState() {
    // This function packs subscribers and ordering into a single row in the existing docs table
    // This achieves cross-device sync without requiring new tables or columns.
    const state = {
        subscribers: appData.subscribers || [],
        adminDocsOrder: appData.adminDocsOrder || [],
        officers: appData.officers || [],
        officersOrder: appData.officersOrder || []
    };

    try {
        const { data: existing } = await supabaseClient.from('admin_docs').select('id').eq('name', '_INTERNAL_STATE_').single();

        if (existing) {
            await supabaseClient.from('admin_docs').update({ url: JSON.stringify(state) }).eq('id', existing.id);
        } else {
            await supabaseClient.from('admin_docs').insert({ name: '_INTERNAL_STATE_', url: JSON.stringify(state) });
        }
    } catch (err) {
        console.warn("Failed to save global state to cloud", err);
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

async function dbHeal(table, data, key) {
    const seen = new Set();
    for (let item of data) {
        const val = item[key] + (item.date || '');
        if (seen.has(val)) {
            try { await supabaseClient.from(table).delete().eq('id', item.id); } catch(e) {}
        } else {
            seen.add(val);
        }
    }
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

// Check if user already signed up for text reminders
function checkPreviousSignup() {
    if (localStorage.getItem('sf_club_signed_up') === 'true') {
        const formContainer = document.getElementById('text-reminder-form-container');
        const successDiv = document.getElementById('text-reminder-success');
        if (formContainer && successDiv) {
            formContainer.style.display = 'none';
            successDiv.style.display = 'flex';
            successDiv.style.opacity = '1';
            successDiv.style.transform = 'none';
            if (window.lucide) lucide.createIcons();
        }
    }
}
// Run check on load
document.addEventListener('DOMContentLoaded', checkPreviousSignup);
window.addEventListener('load', checkPreviousSignup);

// --- RENDERING ---

function renderAll() {
    renderTimeline();
    renderStudentResources();
    renderOfficers();
    renderAdminLists();
    updateTimelineHeader();
    if (window.lucide) lucide.createIcons();
}

function renderOfficers() {
    const container = document.getElementById('officers-container');
    if (!container) return;

    if (!appData.officers || appData.officers.length === 0) {
        container.innerHTML = '';
        // Do NOT return here, so renderAll can continue to renderAdminLists
    } else {
        const regular = appData.officers.filter(o => !o.isAdvisor).slice(0, 6);
        const advisors = appData.officers.filter(o => o.isAdvisor).slice(0, 3);
    
        function groupRegulars(officers) {
            const len = officers.length;
            let rows = [];
            if (len === 0) return rows;
            if (len === 1) rows = [[0]];
            else if (len === 2) rows = [[0, 1]];
            else if (len === 3) rows = [[0, 1, 2]];
            else if (len === 4) rows = [[0, 1], [2, 3]];
            else if (len === 5) rows = [[0, 1, 2], [3, 4]];
            else if (len === 6) rows = [[0, 1, 2], [3, 4, 5]];
            else {
                let i = 0;
                let rem = len % 3;
                if (rem === 1) rows.push([i++]);
                else if (rem === 2) rows.push([i++, i++]);
                while (i < len) rows.push([i++, i++, i++]);
            }
            return rows.map(r => r.map(idx => officers[idx]));
        }
    
        const regGroups = groupRegulars(regular);
    
        let html = '';
        
        for (const group of regGroups) {
            html += `<div class="officer-row">`;
            for (const officer of group) {
                html += renderOfficerCardHTML(officer);
            }
            html += `</div>`;
        }
    
        if (advisors.length > 0) {
            html += `<div style="margin-top: 3rem;">`;
            html += `<div class="officer-row">`;
            for (const adv of advisors) {
                html += renderOfficerCardHTML(adv);
            }
            html += `</div></div>`;
        }
    
        container.innerHTML = html;
    }
}

function renderOfficerCardHTML(officer) {
    const fallbackInitials = officer.name.replace(/\s+/g, '+');
    const fallbackBg = officer.fallbackColor || (officer.isAdvisor ? 'EADDca' : '12284C');
    const fallbackColor = officer.isAdvisor && !officer.fallbackColor ? '12284C' : 'fff';
    const fallbackUrl = `https://ui-avatars.com/api/?name=${fallbackInitials}&background=${fallbackBg}&color=${fallbackColor}&size=128`;
    
    const advisorClass = officer.isAdvisor ? 'advisor-card' : '';
    const advisorStyle = officer.isAdvisor ? 'border: 2px solid var(--primary);' : '';
    
    return `
        <div class="officer-card card-white shadow-hover ${advisorClass}" style="${advisorStyle}">
            <img src="${officer.image || fallbackUrl}" alt="${officer.name}" class="officer-img"
                onerror="this.src='${fallbackUrl}'">
            <div class="officer-info">
                <h4>${officer.name}</h4>
                <div class="officer-role">${officer.role}</div>
                <a onclick="copyEmail('${officer.email}', this)" class="officer-email"
                    style="cursor: pointer;"><i data-lucide="mail"></i>
                    <span>${officer.email}</span></a>
            </div>
        </div>
    `;
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

    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
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
                <i data-lucide="${(res.id === 1 || res.title === 'Member Essentials') ? 'file-text' : (res.icon || 'link')}" class="resource-icon"></i>
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

            // --- Edge-drag tracking state ---
            let _dragActive = false;
            let _lastMouseX = 0;
            let _lastMouseY = 0;
            let _mouseOutside = false;
            let _edgeScrollRAF = null;
            let _fallbackEl = null;

            function onGlobalMouseMove(e) {
                _lastMouseX = e.clientX;
                _lastMouseY = e.clientY;
                _mouseOutside = false;
            }

            function onDocMouseLeave(e) {
                if (!_dragActive) return;
                _mouseOutside = true;

                // Clamp to window edges and keep the fallback clone at the boundary
                const clampedX = Math.max(0, Math.min(window.innerWidth - 1, e.clientX));
                const clampedY = Math.max(0, Math.min(window.innerHeight - 1, e.clientY));
                _lastMouseX = clampedX;
                _lastMouseY = clampedY;

                if (_fallbackEl) {
                    _fallbackEl.style.left = clampedX + 'px';
                    _fallbackEl.style.top = clampedY + 'px';
                }

                startEdgeAutoScroll();
            }

            function onDocMouseEnter() {
                _mouseOutside = false;
                stopEdgeAutoScroll();
            }

            function startEdgeAutoScroll() {
                if (_edgeScrollRAF) return;

                function tick() {
                    if (!_dragActive || !_mouseOutside) {
                        _edgeScrollRAF = null;
                        return;
                    }

                    const scrollContainer = docsList; 
                    if (scrollContainer) {
                        const rect = scrollContainer.getBoundingClientRect();
                        const edgeZone = 80; // Increased zone
                        const speed = 15; // Increased speed

                        // Scroll up when cursor is near/above the top edge
                        if (_lastMouseY <= rect.top + edgeZone) {
                            scrollContainer.scrollTop -= speed;
                        }
                        // Scroll down when cursor is near/below the bottom edge
                        if (_lastMouseY >= rect.bottom - edgeZone) {
                            scrollContainer.scrollTop += speed;
                        }
                    }

                    _edgeScrollRAF = requestAnimationFrame(tick);
                }

                _edgeScrollRAF = requestAnimationFrame(tick);
            }

            function stopEdgeAutoScroll() {
                if (_edgeScrollRAF) {
                    cancelAnimationFrame(_edgeScrollRAF);
                    _edgeScrollRAF = null;
                }
            }

            docsList._sortable = Sortable.create(docsList, {
                handle: '.drag-handle',
                animation: 300,
                easing: "cubic-bezier(0.2, 0, 0, 1)",
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                forceFallback: true, // This makes the item follow the mouse more accurately
                fallbackClass: "sortable-fallback",
                fallbackOnBody: true,
                fallbackTolerance: 3, 
                delay: 100, // Small delay for touch pickup
                delayOnTouchOnly: true,
                touchStartThreshold: 5, // Allow 5px of movement before canceling drag
                swapThreshold: 0.65,
                invertSwap: true,
                scroll: docsList, // Explicitly set the scroll container
                scrollSensitivity: 100, // Very sensitive for mobile
                scrollSpeed: 20,
                removeCloneOnHide: false,
                onStart: function (evt) {
                    _dragActive = true;
                    _mouseOutside = false;

                    // Grab fallback clone on next frame (SortableJS creates it asynchronously)
                    requestAnimationFrame(() => {
                        _fallbackEl = document.querySelector('.sortable-fallback');
                    });

                    // Register global listeners
                    document.addEventListener('mousemove', onGlobalMouseMove, true);
                    document.documentElement.addEventListener('mouseleave', onDocMouseLeave);
                    document.documentElement.addEventListener('mouseenter', onDocMouseEnter);
                },
                onEnd: function (evt) {
                    _dragActive = false;
                    _mouseOutside = false;
                    _fallbackEl = null;
                    stopEdgeAutoScroll();

                    // Clean up global listeners
                    document.removeEventListener('mousemove', onGlobalMouseMove, true);
                    document.documentElement.removeEventListener('mouseleave', onDocMouseLeave);
                    document.documentElement.removeEventListener('mouseenter', onDocMouseEnter);

                    const newOrderIds = Array.from(docsList.children).map(child => child.getAttribute('data-id'));

                    // Update appData.adminDocs locally based on new order
                    const newAdminDocs = [];
                    newOrderIds.forEach(id => {
                        const doc = appData.adminDocs.find(d => String(d.id) === String(id));
                        if (doc) newAdminDocs.push(doc);
                    });
                    appData.adminDocs = newAdminDocs;

                    // Save the ID order specifically to localStorage
                    appData.adminDocsOrder = newOrderIds;
                    localStorage.setItem('sf_club_data', JSON.stringify(appData));

                    // Sync to cloud using the internal state row
                    saveGlobalState();
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

    // Admin Subscribers List
    const subsList = document.getElementById('admin-subscribers-list');
    if (subsList) {
        if (!appData.subscribers || appData.subscribers.length === 0) {
            subsList.innerHTML = `
                <div style="height: 150px; display: flex; align-items: center; justify-content: center; width: 100%; color: var(--text-muted); font-style: italic; font-size: 1.1rem;">
                    No subscribers yet.
                </div>`;
        } else {
            subsList.innerHTML = (appData.subscribers || []).map(sub => `
                <div class="manage-item card-item" style="padding: 0.75rem 1rem;" data-id="${sub.id || sub.phone}">
                    <div class="item-info">
                        <strong style="color: var(--primary);">${sub.name}</strong>
                        <div style="font-family: monospace; font-size: 0.95rem; margin-top: 0.2rem;">${sub.phone}</div>
                    </div>
                    <div class="item-actions">
                        <button class="icon-btn danger" onclick="deleteSubscriber(${sub.id ? sub.id : `'${sub.phone}'`})"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Admin Officers List
    const officersList = document.getElementById('admin-officers-list');
    const advisorsList = document.getElementById('admin-advisors-list');
    
    const allOfficers = appData.officers || [];
    const regular = allOfficers.filter(o => !o.isAdvisor);
    const advs = allOfficers.filter(o => o.isAdvisor);

    function createOfficerManageItem(officer) {
        const fallbackBg = officer.fallbackColor || (officer.isAdvisor ? 'EADDca' : '12284C');
        const fallbackColor = officer.isAdvisor && !officer.fallbackColor ? '12284C' : 'fff';
        const fallbackUrl = `https://ui-avatars.com/api/?name=${officer.name.replace(/\s+/g, '+')}&background=${fallbackBg}&color=${fallbackColor}`;
        return `
        <div class="manage-item card-item" data-id="${officer.id}" style="padding: 0.75rem;">
            <div class="drag-handle" style="cursor: grab; margin-right: 0.5rem; color: var(--text-muted);"><i data-lucide="grip-vertical"></i></div>
            <img src="${officer.image || fallbackUrl}" onerror="this.src='${fallbackUrl}'" style="width:40px; height:40px; border-radius:50%; object-fit:cover; margin-right:10px; flex-shrink:0;">
            <div class="item-info" style="flex: 1;">
                <strong style="color: var(--primary);">${officer.name}</strong>
                <div class="item-meta">${officer.role} • ${officer.email}</div>
            </div>
            <div class="item-actions">
                <button class="icon-btn" onclick="editOfficer('${officer.id}')"><i data-lucide="edit-3"></i></button>
                <button class="icon-btn danger" onclick="deleteOfficer('${officer.id}')"><i data-lucide="trash-2"></i></button>
            </div>
        </div>
        `;
    }

    if (officersList) {
        if (regular.length === 0) {
            if (officersList._sortable) {
                officersList._sortable.destroy();
                officersList._sortable = null;
            }
            officersList.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-style: italic; padding: 1rem; border: 1px dashed var(--border-color); border-radius: 8px;">No student officers yet.</div>`;
        } else {
            officersList.innerHTML = regular.map(createOfficerManageItem).join('');
            if (window.Sortable) {
                if (officersList._sortable) officersList._sortable.destroy();
                officersList._sortable = Sortable.create(officersList, {
                    handle: '.drag-handle',
                    animation: 300,
                    forceFallback: true,
                    fallbackClass: "sortable-fallback",
                    fallbackOnBody: true,
                    onEnd: function () { saveOfficerOrder(); }
                });
            }
        }
    }

    if (advisorsList) {
        if (advs.length === 0) {
            if (advisorsList._sortable) {
                advisorsList._sortable.destroy();
                advisorsList._sortable = null;
            }
            advisorsList.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-style: italic; padding: 1rem; border: 1px dashed var(--border-color); border-radius: 8px;">No faculty advisors yet.</div>`;
        } else {
            advisorsList.innerHTML = advs.map(createOfficerManageItem).join('');
            if (window.Sortable) {
                if (advisorsList._sortable) advisorsList._sortable.destroy();
                advisorsList._sortable = Sortable.create(advisorsList, {
                    handle: '.drag-handle',
                    animation: 300,
                    forceFallback: true,
                    fallbackClass: "sortable-fallback",
                    fallbackOnBody: true,
                    onEnd: function () { saveOfficerOrder(); }
                });
            }
        }
    }

    function saveOfficerOrder() {
        const oIds = Array.from(officersList?.querySelectorAll('.manage-item') || []).map(child => child.getAttribute('data-id'));
        const aIds = Array.from(advisorsList?.querySelectorAll('.manage-item') || []).map(child => child.getAttribute('data-id'));
        
        const newOrderIds = [...oIds, ...aIds];
        const newOfficers = [];
        newOrderIds.forEach(id => {
            const off = appData.officers.find(o => String(o.id) === String(id));
            if (off) newOfficers.push(off);
        });
        
        // Push any remaining officers that weren't in the lists
        appData.officers.forEach(o => {
            if (!newOrderIds.includes(String(o.id))) newOfficers.push(o);
        });

        appData.officers = newOfficers;
        appData.officersOrder = appData.officers.map(o => String(o.id));
        
        localStorage.setItem('sf_club_data', JSON.stringify(appData));
        saveGlobalState();
        renderOfficers();
    }
    
    if (window.lucide) lucide.createIcons();
}

window.copyAllSubscribers = function () {
    if (!appData.subscribers || appData.subscribers.length === 0) return;
    const list = appData.subscribers.map(s => `${s.name}\\t${s.phone}`).join('\\n');
    navigator.clipboard.writeText(list).then(() => {
        alert("Copied " + appData.subscribers.length + " subscribers to clipboard!");
    });
}

window.deleteSubscriber = async function (idStr) {
    if (confirm('Remove this subscriber?')) {
        try {
            // Optimistic UI: Remove from DOM immediately to prevent flash
            const row = document.querySelector(`#admin-subscribers-list [data-id="${idStr}"]`);
            if (row) {
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                row.style.transition = 'all 0.3s ease';
                setTimeout(() => row.remove(), 300);
            }

            if (typeof idStr === 'number') {
                await supabaseClient.from('subscribers').delete().eq('id', idStr);
            } else {
                await supabaseClient.from('subscribers').delete().eq('phone', idStr);
            }

            appData.subscribers = appData.subscribers.filter(s => s.id !== idStr && s.phone !== idStr);
            localStorage.setItem('sf_club_data', JSON.stringify(appData));

            // Sync to cloud state
            await saveGlobalState();

            // If the list is now empty, re-render to show centering
            if (appData.subscribers.length === 0) renderAdminLists();
        } catch (err) {
            console.error("Error deleting subscriber:", err);
            renderAdminLists(); // Revert on failure
        }
    }
}

function updateTimelineHeader() {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter out expired events based on custom thresholds:
    // - Deadlines: Midnight (start of next day)
    // - Trips/Meetings: 4:00 PM (16:00)
    const activeEvents = (appData.calendar || []).filter(event => {
        const eventDate = parseDate(event.date);
        const dayOf = new Date(eventDate);
        dayOf.setHours(0, 0, 0, 0);
        
        if (event.type === 'deadline') {
            const expiry = new Date(dayOf);
            expiry.setDate(expiry.getDate() + 1);
            return now < expiry;
        } else {
            const expiry = new Date(dayOf);
            expiry.setHours(16, 0, 0, 0);
            return now < expiry;
        }
    }).sort((a, b) => parseDate(a.date) - parseDate(b.date));

    let todaysEvents = [];
    let tomorrowsEvents = [];
    let nextEvent = null;

    activeEvents.forEach(event => {
        const eventDate = parseDate(event.date);
        const eventDayStart = new Date(eventDate);
        eventDayStart.setHours(0, 0, 0, 0);

        if (eventDayStart.getTime() === today.getTime()) {
            todaysEvents.push(event.title);
        } else if (eventDayStart.getTime() === tomorrow.getTime()) {
            tomorrowsEvents.push(event.title);
        } else if (eventDayStart > today && !nextEvent) {
            nextEvent = event;
        }
    });

    let bannerMsg = "";
    if (todaysEvents.length > 0) {
        bannerMsg = `<strong>Event Today:</strong> Don't forget about the <strong>${todaysEvents.join(' & ')}</strong>!`;
    } else if (tomorrowsEvents.length > 0) {
        bannerMsg = `<strong>Event Tomorrow:</strong> Get ready for the <strong>${tomorrowsEvents.join(' & ')}</strong>!`;
    } else if (nextEvent) {
        bannerMsg = `<strong>Next Event:</strong> ${formatDateForDisplay(nextEvent.date)} - ${nextEvent.title}`;
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
    // Prevent background header animations while the admin modal is open
    if (document.body.classList.contains('modal-open')) return;

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
    mobileBtn.addEventListener('click', (event) => {
        navLinks.classList.toggle('active');
        updateHeader();
        event.stopPropagation(); // Prevent document click from immediately closing it
    });
}

// Close mobile menu when clicking outside of it
document.addEventListener('click', (event) => {
    if (navLinks && navLinks.classList.contains('active')) {
        if (!mobileBtn.contains(event.target) && !navLinks.contains(event.target)) {
            navLinks.classList.remove('active');
            updateHeader();
        }
    }
});

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
    if (localStorage.getItem('is_logged_in') === 'true') {
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
        localStorage.setItem('is_logged_in', 'true');
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
    document.getElementById("admin-dashboard").style.display = "flex";
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
        
        // Lock the width of the entire button and center its contents
        element.style.width = element.offsetWidth + 'px';
        element.style.justifyContent = 'center';

        span.innerText = "Copied!";
        element.style.color = "#16a34a";
        setTimeout(() => {
            span.innerText = originalText;
            element.style.color = "";
            element.style.width = '';
            element.style.justifyContent = '';
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
        } else if (currentEditType === 'officer') {
            const officer = {
                id: currentEditId || Date.now(),
                name: data.name,
                role: data.role,
                email: data.email,
                image: data.image,
                isAdvisor: data.isAdvisor === 'on'
            };
            if (!appData.officers) appData.officers = [];
            
            if (currentEditId) {
                const idx = appData.officers.findIndex(o => String(o.id) === String(currentEditId));
                if (idx !== -1) appData.officers[idx] = officer;
            } else {
                appData.officers.push(officer);
            }
            
            localStorage.setItem('sf_club_data', JSON.stringify(appData));
            await saveGlobalState();
            closeFormModal();
            renderOfficers();
            renderAdminLists();
            return; // Return early because we don't use Supabase table logic
        }

        if (error) throw error;

        closeFormModal();
        loadDataAndSync(); // optimistic loading to make UI instantly responsive
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

// --- TEXT REMINDERS ---
const phoneInput = document.getElementById('reminder-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        // Keep only digits, up to 10
        const input = e.target.value.replace(/\D/g, '').substring(0, 10);
        const zip = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, 10);

        if (input.length > 6) {
            e.target.value = `(${zip}) ${middle}-${last}`;
        } else if (input.length > 3) {
            e.target.value = `(${zip}) ${middle}`;
        } else if (input.length > 0) {
            e.target.value = `(${zip}`;
        } else {
            e.target.value = '';
        }
    });
}

const reminderForm = document.getElementById('text-reminder-form');
if (reminderForm) {
    reminderForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const firstName = document.getElementById('reminder-first-name').value;
        const phone = document.getElementById('reminder-phone').value;

        if (!appData.subscribers) appData.subscribers = [];
        appData.subscribers.unshift({ name: firstName, phone: phone, id: Date.now() });
        localStorage.setItem('sf_club_signed_up', 'true');
        localStorage.setItem('sf_club_data', JSON.stringify(appData));

        // Sync to cloud row
        saveGlobalState();
        renderAdminLists();

        try {
            // Also attempt direct insert in case they DO have the table
            await supabaseClient.from('subscribers').insert({ name: firstName, phone: phone });
        } catch (err) { /* Silent fail if table missing */ }

        // Send Email notification using EmailJS
        try {
            const now = new Date();
            const emailParams = {
                name: firstName,
                phone: phone,
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString()
            };
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_eosubks', 'template_pycgjtk', emailParams, 'W3ns6jMkHbfgnmWK9');
            }
        } catch(err) {
            console.error("EmailJS error:", err);
        }

        const formContainer = document.getElementById('text-reminder-form-container');
        const successDiv = document.getElementById('text-reminder-success');

        // 1. Fade out and slide down the form
        formContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        formContainer.style.opacity = '0';
        formContainer.style.transform = 'translateY(10px)';

        setTimeout(() => {
            formContainer.style.display = 'none';

            // 2. Prepare the success message state
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(10px)';
            successDiv.style.display = 'flex';

            // Force a browser reflow before animating in
            void successDiv.offsetWidth;

            // 3. Fade in and slide up the success message
            successDiv.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            successDiv.style.opacity = '1';
            successDiv.style.transform = 'translateY(0)';

            if (window.lucide) lucide.createIcons();
        }, 300);
    });
}

// Initial Render
renderAll();

// OFFICERS
window.showAddOfficerForm = function () {
    currentEditType = 'officer';
    openFormModal('Add Officer', getOfficerFields());
}

window.editOfficer = function (id) {
    const officer = appData.officers.find(o => String(o.id) === String(id));
    currentEditType = 'officer';
    currentEditId = id;
    openFormModal('Edit Officer', getOfficerFields(officer));
}

window.deleteOfficer = async function (id) {
    if (confirm('Are you sure you want to remove this officer?')) {
        const idStr = String(id);
        appData.officers = appData.officers.filter(o => String(o.id) !== idStr);
        if (appData.officersOrder) {
            appData.officersOrder = appData.officersOrder.filter(oid => String(oid) !== idStr);
        }
        localStorage.setItem('sf_club_data', JSON.stringify(appData));
        await saveGlobalState();
        renderAll();
    }
}

window.removeOfficerPhoto = function() {
    document.getElementById('officer-image-b64').value = '';
    document.getElementById('photo-trash-btn').style.display = 'none';
    updateOfficerPreviewFallback();
}

window.updateOfficerPreviewFallback = function() {
    const nameInput = document.querySelector('input[name="name"]');
    const b64 = document.getElementById('officer-image-b64')?.value;
    const previewCircle = document.getElementById('photo-preview-circle');
    const chooseBtnContainer = document.getElementById('choose-image-container');
    
    if (!previewCircle) return;
    
    if (b64 && b64.length > 0) {
        if (previewCircle.dataset.current !== 'b64') {
            previewCircle.innerHTML = `<img src="${b64}" class="animate-fade-in" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            previewCircle.dataset.current = 'b64';
        }
        const trashBtn = document.getElementById('photo-trash-btn');
        if (trashBtn) trashBtn.style.display = 'flex';
        if (chooseBtnContainer) chooseBtnContainer.classList.remove('expanded');
        return;
    }
    
    const trashBtn = document.getElementById('photo-trash-btn');
    if (trashBtn) trashBtn.style.display = 'none';
    if (chooseBtnContainer) chooseBtnContainer.classList.add('expanded');
    
    if (nameInput && nameInput.value.trim().length > 0) {
        const currentName = nameInput.value.trim();
        const initialsUrl = `https://ui-avatars.com/api/?name=${currentName.replace(/\s+/g, '+')}&background=12284C&color=fff&size=128`;
        if (previewCircle.dataset.current !== currentName) {
            previewCircle.innerHTML = `<img src="${initialsUrl}" class="animate-fade-in" style="width: 100%; height: 100%; border-radius: 50%;">`;
            previewCircle.dataset.current = currentName;
        }
    } else {
        if (previewCircle.dataset.current !== 'camera') {
            previewCircle.innerHTML = `<i data-lucide="camera" class="animate-fade-in" style="width: 40px; height: 40px; color: #94a3b8;"></i>`;
            previewCircle.dataset.current = 'camera';
            if (window.lucide) lucide.createIcons();
        }
    }
}

function getOfficerFields(data = {}) {
    let defaultPreview = '';
    if (data.image) {
        defaultPreview = `<img src="${data.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else if (data.name) {
        defaultPreview = `<img src="https://ui-avatars.com/api/?name=${data.name.replace(/\s+/g, '+')}&background=12284C&color=fff&size=128" style="width: 100%; height: 100%; border-radius: 50%;">`;
    } else {
        defaultPreview = `<i data-lucide="camera" style="width: 40px; height: 40px; color: #94a3b8;"></i>`;
    }

    return `
        <div class="form-group" style="text-align: center; margin-bottom: 1.5rem;">
            <div style="position: relative; display: inline-block;">
                <div id="photo-preview-circle" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--primary); padding: 3px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden; margin: 0 auto;">
                    ${defaultPreview}
                </div>
                
                <div id="photo-trash-btn" style="display: ${data.image ? 'flex' : 'none'}; position: absolute; bottom: 0; right: 0; background: var(--primary); color: white; width: 28px; height: 28px; border-radius: 50%; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" onclick="removeOfficerPhoto()">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </div>
            </div>
            
            <div id="choose-image-container" class="smooth-collapse mt-3 ${data.image ? '' : 'expanded'}">
                <label for="officer-photo-upload" class="btn btn-sm btn-navy" style="cursor: pointer; display: inline-flex; align-items: center; justify-content: center; margin: 0;">
                    <i data-lucide="upload" style="width:16px;height:16px;margin-right:6px;"></i> Choose Image
                </label>
                <input type="file" id="officer-photo-upload" accept="image/*" style="display:none;" onchange="handleOfficerPhoto(this)">
            </div>
            
            <input type="hidden" name="image" id="officer-image-b64" value="${data.image || ''}">
            
            <div id="crop-container" class="smooth-collapse mt-4" style="text-align: left;">
                <div style="max-width: 100%; max-height: 300px; margin-bottom: 1rem;">
                    <img id="crop-image" style="max-width: 100%; display: block;">
                </div>
                <div style="text-align: right;">
                    <button type="button" class="btn btn-sm btn-navy" onclick="confirmCrop()">Crop & Save</button>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${data.name || ''}" class="form-control" required placeholder="John Doe" oninput="updateOfficerPreviewFallback()" autocomplete="off">
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>Role</label>
            <input type="text" name="role" value="${data.role || ''}" class="form-control" required placeholder="President" autocomplete="off">
        </div>
        <div class="form-group" style="margin-top:1rem">
            <label>Email</label>
            <input type="email" name="email" value="${data.email || ''}" class="form-control" required placeholder="email@banks.k12.or.us" autocomplete="off">
        </div>
        <div class="form-group" style="margin-top:1.5rem">
            <label class="custom-checkbox">
                <input type="checkbox" name="isAdvisor" ${data.isAdvisor ? 'checked' : ''}>
                Is Faculty Advisor
            </label>
        </div>
    `;
}

let currentCropper = null;

window.handleOfficerPhoto = function(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const cropContainer = document.getElementById('crop-container');
            const cropImage = document.getElementById('crop-image');
            
            cropContainer.classList.add('expanded');
            cropImage.src = e.target.result;
            
            if (currentCropper) {
                currentCropper.destroy();
            }
            
            currentCropper = new Cropper(cropImage, {
                aspectRatio: 1,
                viewMode: 1,
                minCropBoxWidth: 100,
                minCropBoxHeight: 100,
            });
        }
        reader.readAsDataURL(file);
        
        input.value = '';
    }
}

window.confirmCrop = function() {
    if (currentCropper) {
        const canvas = currentCropper.getCroppedCanvas({
            width: 400,
            height: 400
        });
        const b64 = canvas.toDataURL('image/jpeg', 0.8);
        document.getElementById('officer-image-b64').value = b64;
        
        document.getElementById('crop-container').classList.remove('expanded');
        
        updateOfficerPreviewFallback();
        
        currentCropper.destroy();
        currentCropper = null;
    }
}

// Mission Carousel Logic
let currentSlide = 0;
const totalSlides = 5;
let autoSlideInterval;

window.moveCarousel = function(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoSlide();
}

window.goToSlide = function(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoSlide();
}

function updateCarousel() {
    const inner = document.getElementById('mission-carousel-inner');
    const indicators = document.querySelectorAll('.indicator');
    
    if (inner) {
        inner.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    indicators.forEach((ind, i) => {
        if (i === currentSlide) ind.classList.add('active');
        else ind.classList.remove('active');
    });
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

function startAutoSlide() {
    if (autoSlideInterval) return;
    autoSlideInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
}

// Initialize carousel with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel();
    
    const carouselSection = document.querySelector('.mission-carousel');
    if (carouselSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoSlide();
                } else {
                    stopAutoSlide();
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the carousel is visible
        
        observer.observe(carouselSection);
    }
});
// --- CHAT WIDGET LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const chatSuccess = document.getElementById('chat-success');
    const openIcon = document.querySelector('.chat-icon-open');
    const closeIcon = document.querySelector('.chat-icon-close');
    const chatWidget = document.getElementById('chat-widget');

    if (!chatToggle || !chatWindow || !chatWidget) return;

    const toggleChat = (forceClose = false) => {
        const isClosing = forceClose || chatWindow.style.display === 'flex';
        
        if (!isClosing) {
            chatWindow.style.display = 'flex';
            chatWindow.classList.remove('closing');
            openIcon.style.display = 'none';
            closeIcon.style.display = 'block';
            chatForm.style.display = 'block';
            chatSuccess.style.display = 'none';
            chatSuccess.classList.remove('chat-success-pop');
        } else if (chatWindow.style.display === 'flex') {
            chatWindow.classList.add('closing');
            openIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            // Wait for the closing animation to finish before hiding
            setTimeout(() => {
                chatWindow.style.display = 'none';
                chatWindow.classList.remove('closing');
            }, 200);
        }
    };

    chatToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChat();
    });

    document.addEventListener('click', (e) => {
        if (!chatWidget.contains(e.target) && chatWindow.style.display === 'flex') {
            toggleChat(true);
        }
    });

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('chat-submit-btn');
            const submitSpan = submitBtn.querySelector('span');
            const originalText = submitSpan ? submitSpan.innerText : submitBtn.innerText;
            if (submitSpan) submitSpan.innerText = 'Sending...';
            else submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const templateParams = {
                first_name: document.getElementById('chat-first-name').value,
                last_name: document.getElementById('chat-last-name').value,
                email: document.getElementById('chat-email').value,
                message: document.getElementById('chat-message').value,
                to_name: "Science Field Club Leadership"
            };

            try {
                // EmailJS Credentials provided by USER
                await emailjs.send(
                    'service_zjs4xto', 
                    'template_cm9wv1k', 
                    templateParams,
                    'qe_Z_EwImCbqDDLfJ'
                );
                
                chatForm.style.display = 'none';
                chatSuccess.style.display = 'block';
                
                chatForm.reset();
            } catch (error) {
                console.error('EmailJS Error:', error);
                alert('Oops! Something went wrong while sending your message. Please try again later.');
            } finally {
                if (submitSpan) submitSpan.innerText = originalText;
                else submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
