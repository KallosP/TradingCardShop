import backendURL from '../constants/url-constants'

export default async function getUserBalance() {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${backendURL}/users/me/balance`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()

        // Update user object in localStorage with fresh balance
        const user = JSON.parse(localStorage.getItem('user'))
        localStorage.setItem('user', JSON.stringify({ ...user, balance: data.balance })) // Update user object with new balance from response
        // (Chose to use events/local storage instead of prop drilling for balance update in Navbar)
        window.dispatchEvent(new Event('balanceUpdated')) // Notify other components (Navbar) of balance update
    } catch (err) {
        alert('Failed to fetch balance. Please refresh the page.')
        console.error('Failed to fetch balance:', err)
    }
}