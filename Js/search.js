function searchTable() {
    const searchInput = document.getElementById('form1').value.toLowerCase();
    const table = document.getElementById('table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      let found = false;

      for (let j = 0; j < cells.length; j++) {
        const cellText = cells[j].textContent.toLowerCase();

        if (cellText.includes(searchInput)) {
          cells[j].innerHTML = cellText.replace(new RegExp(searchInput, 'gi'), match => `<span class="highlight">${match}</span>`);
          found = true;
        } else {
          cells[j].innerHTML = cellText;
        }
      }

      if (found) {
        rows[i].style.display = '';
      } else {
        rows[i].style.display = 'none';
      }
    }
  }
  
 
 