const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("search");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

let editingIndex = null;

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString();
}

function renderNotes() {
    const keyword = (searchInput?.value || "").toLowerCase().trim();

    notesList.innerHTML = "";

    const filteredNotes = notes.filter((n)=> {
        const haystack = `${n.title} ${n.content}`.toLowerCase();
        return haystack.includes(keyword);
    });

    if (filteredNotes.length === 0) {
        notesList.innerHTML = `<p style="color:#94a3b8;">Tidak ada catatan yang cocok.</p>`;
        return;
    }

    filteredNotes.forEach((note) => {
        const originalIndex = notes.indexOf(note); 

        const div = document.createElement("div");
        div.className = "note";

        div.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <p style="color:#94a3b8; font-size:0.9rem;">
            Dibuat: ${formatDate(note.createdAt)}
            ${note.updatedAt ? ` • Diupdate: ${formatDate(note.updatedAt)}` : ""}
        </p>

        <div class="note-actions">
            <button onclick="startEdit(${originalIndex})">Edit</button>
            <button class="delete-btn" onclick="deleteNote(${originalIndex})">Hapus</button>
        </div>
        `;

    notesList.appendChild(div);
  });
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function startEdit(index) {
    editingIndex = index;

    titleInput.value = notes[index].title;
    contentInput.value = notes[index].content;

    noteForm.querySelector('button[type:"submit"]').textContent = "Update Catatan";
    titleInput.focus();
}

function resetFormToCreateMode() {
    editingIndex = null;
    noteForm.reset();
    noteForm.querySelector('button[type="submit"]').textContent = "Tambah Catatan";
}

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return;

    if (editingIndex !== null) {
        notes[editingIndex].title = title;
        notes[editingIndex].content = content;
        notes[editingIndex].updatedAt = new Date().toISOString();
        saveNotes();
        renderNotes();
        resetFormToCreateMode();
        return;
    }

    const newNote = {
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };
    
    notes.push(newNote);
    saveNotes();
    renderNotes();
    resetFormToCreateMode();
});

if (searchInput) {
    searchInput.addEventListener("input", renderNotes);
}

renderNotes();