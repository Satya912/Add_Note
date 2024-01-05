// na3-client.js
const addBtn = document.getElementById('add');

addBtn.addEventListener('click', addNewNote);

async function addNewNote() {
  const note = document.createElement('div');
  note.classList.add('note');
  note.innerHTML = `
    <div class="tools">
      <button class="edit"><i class="fas fa-edit"></i></button>
      <button class="delete"><i class="fas fa-trash-alt"></i></button>
      <button class="done"><i class="fas fa-check"></i> Done</button>
    </div>
    <div class="main hidden"></div>
    <textarea></textarea>
  `;

  const editBtn = note.querySelector('.edit');
  const deleteBtn = note.querySelector('.delete');
  const doneBtn = note.querySelector('.done');
  const main = note.querySelector('.main');
  const textArea = note.querySelector('textarea');

  deleteBtn.addEventListener('click', async () => {
    note.remove();
  });

  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    textArea.classList.toggle('hidden');
  });

  textArea.addEventListener('input', (e) => {
    const { value } = e.target;
    main.innerHTML = marked(value);
  });

  doneBtn.addEventListener('click', async () => {
    alert('Note marked as done!');
    updateLS();
    const content = textArea.value;
    const savedNote = await saveNoteToDatabase(content);
    note.setAttribute('data-note-id', savedNote._id);
  });

  document.body.appendChild(note);
}

async function saveNoteToDatabase(content) {
  try {
    const response = await fetch('http://localhost:3000/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving note:', error);
  }
}


function updateLS() {
  const notesText = document.querySelectorAll('textarea');
  const notes = Array.from(notesText).map(note => note.value);
  localStorage.setItem('notes', JSON.stringify(notes));
}
