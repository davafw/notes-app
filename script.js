const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
    notesList.innerHTML = "";

    notes.forEach((note, index) => {
        const div = document.createElement("div");
        div.className = "note";

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-actions">
        <button class="delete-btn" onclick="deleteNote(${index})">Hapus</button>
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

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newNote = {
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
    };
    if (!newNote.title || !newNote.content) return;

    notes.push(newNote);
    saveNotes();
    renderNotes();

    noteForm.reset();
});

renderNotes();