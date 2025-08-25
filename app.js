let API_URL = 'http://10.69.0.140:3000';

let invoicesCount = document.getElementById('invoices-count');
let main = document.querySelector('main');
let newBtn = document.getElementById('new-invoice');
let modal = document.getElementById('invoice-modal');
let form = document.getElementById('invoice-form');
let cancelBtn = document.getElementById('cancel-invoice');

async function getInvoices() {
    let res = await fetch(API_URL + '/invoices');
    let data = await res.json();
    allInvoices = data;
    showInvoices(data);
    invoicesCount.textContent = data.length;
}

function showInvoices(list) {
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].remove();
    }

    for (let i = 0; i < list.length; i++) {
        let card = makeCard(list[i]);
        main.appendChild(card);
    }
}

function makeCard(invoice) {
    let div = document.createElement('div');
    div.className = 'card';

    let color = 'var(--grey)';
    if (invoice.status === 'paid') color = 'var(--green)';
    if (invoice.status === 'pending') color = 'var(--orange)';

    let date = new Date(invoice.date);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateStr = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

    let price = invoice.price.toFixed(2);

    let status = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);

    div.innerHTML =
        '<div class="card-tag"><span>#</span><h5>' + invoice.tag + '</h5></div>' +
        '<span>Due ' + dateStr + '</span>' +
        '<span>' + invoice.name + '</span>' +
        '<h5><span>£</span><span>' + price + '</span></h5>' +
        '<div class="card-status" style="--status-color: ' + color + '">' +
        '<div class="card-status-circle"></div>' +
        '<h5>' + status + '</h5>' +
        '</div>';

    return div;
}

function openModal() {
    modal.showModal();
}

function closeModal() {
    modal.close();
    form.reset();
}

async function sendInvoice(invoice) {
    let res = await fetch(API_URL + '/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
    });
    let data = await res.json();
    allInvoices.push(data);
    showInvoices(allInvoices);
    invoicesCount.textContent = allInvoices.length;
    closeModal();
}

function submitForm(e) {
    e.preventDefault();

    let invoice = {
        name: document.getElementById('invoice-name').value,
        tag: document.getElementById('invoice-tag').value,
        price: parseFloat(document.getElementById('invoice-price').value),
        status: document.getElementById('invoice-status').value,
        date: document.getElementById('invoice-date').value
    };

    sendInvoice(invoice);
}

newBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
form.addEventListener('submit', submitForm);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    getInvoices();
});
