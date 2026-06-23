const API_URL = "http://localhost:5000/api";

// 1. CREATE ACCOUNT
async function createAccount() {
    const bank = document.getElementById('reg-bank').value;
    const name = document.getElementById('reg-name').value;
    const amount = parseFloat(document.getElementById('reg-amount').value);
    const accNo = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();

    const response = await fetch(`${API_URL}/create-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank, name, accNo, amount })
    });

    if (response.ok) {
        alert("Account Created in MySQL! Acc No: " + accNo);
        showTab('dashboard');
    }
}

// 2. DEPOSIT
async function depositMoney() {
    const accNo = document.getElementById('dep-acc-no').value;
    const amount = parseFloat(document.getElementById('dep-amount').value);

    const response = await fetch(`${API_URL}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accNo, amount })
    });

    if (response.ok) {
        alert("Money Deposited in MySQL!");
        updateDashboard();
    }
}

// 3. UPDATE DASHBOARD (Get data from MySQL)
async function updateDashboard() {
    const response = await fetch(`${API_URL}/accounts`);
    const accounts = await response.json();

    const totalCash = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    document.getElementById('stat-customers').innerText = accounts.length;
    document.getElementById('stat-balance').innerText = totalCash.toLocaleString();

    const tableBody = document.getElementById('recent-accounts-table');
    tableBody.innerHTML = "";
    accounts.slice(0, 5).forEach(acc => {
        tableBody.innerHTML += `
            <tr class="border-b">
                <td class="py-4 text-xs font-bold">${acc.bank_name}</td>
                <td class="py-4 font-mono text-blue-600">${acc.account_no}</td>
                <td>${acc.customer_name}</td>
                <td class="text-right font-bold">₹ ${parseFloat(acc.balance).toLocaleString()}</td>
            </tr>`;
    });
}