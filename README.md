**🎓 Student Finance Tracker**

The Student Finance Tracker is a lightweight, browser-based financial management tool designed to help students take control of their income, spending habits, and savings goals.
It offers a clear, structured interface for budgeting, transaction tracking, and performance analytics — all tailored for students managing limited finances with big ambitions.

**📁 Project Structure**

The project is organized as follows:

/Student-Finance-Tracker
│
├── test.html                  # Main HTML file (entry point)
│
├── /js
│   └── main.js                # Core JavaScript logic and functionality
│
├── /style
│   └── style.css              # All styles used throughout the application
│
├── /assets              
│   └── [images]              # Additional images used in the UI

**🚀 How to Launch**

To run the application locally:

Clone the repository to your local machine using your web terminal:

git clone []


Navigate to the project folder and open the index.html file (originally referred to as test.html) using Live Server or any live preview tool:

For example, in VS Code:

Right-click index.html → "Open with Live Server"

**⚙️ Application Workflow**
**1. Settings Section**

Upon initial use, the user must configure financial preferences via the Settings page:

Monthly Income: Base income for budgeting.

Maximum Monthly Spending (Monthly Cap): The spending limit for the month; intended savings are automatically computed as the difference between income and cap.

Currency Selection: Options include:

Default (None) — treated as Rwandan Francs (RWF)

USD — US Dollars

EUR — Euro

NGN — Nigerian Naira

Exchange Rate Input: Users manually input the current exchange rate for the selected currency.

Theme Selection: Users can toggle between Light Mode and Dark Mode for a personalized viewing experience.

Save Settings: All preferences are stored in the browser’s localStorage for persistence across sessions.

**2. Add Transaction Section**

Accessible via the navigation menu, this section allows users to manually add transactions with the following details:

Type of Transaction: Income or Expense

Description: Brief text explaining the nature of the transaction

Amount: The monetary value involved

Category: Classification of expense (e.g., Food, Transport, Tuition)

Date: Date of the transaction

createdAt: Automatically generated based on the current date

updatedAt: Automatically updated when a transaction is edited

**3. Records Section**

This section displays all user-entered transactions in a tabular format with powerful controls:

Edit/Delete Options: Transactions can be edited or permanently deleted.

Sorting Functionality:

By Date: Ascending or descending order

By Amount: Ascending or descending order

By Description: Alphabetical (A–Z or Z–A)

Search Function:

Enables keyword or numeric searches

Matches are highlighted in yellow for easy visibility

**4. Dashboard Section**

A visual summary of the user’s financial activity:

Total Income: Combination of monthly income (from Settings) and additional income transactions

Planned Savings: Based on the difference between monthly income and monthly cap

Total Expenses: Aggregated from the records

Difference from Cap: Shows how much spending deviates from the planned budget

Top Expense Category: Displays the category with the highest total expenditure

7-Day Trend Visualization: A graphical representation of spending activity over the past week

**5. About Section**

This section outlines the purpose and vision behind the app:

Mission: To empower students with simple yet powerful financial tools to build responsible money habits.

Vision: A generation of financially literate students confidently shaping their future.

Core Values: Transparency, Empowerment, Simplicity, and Growth.

**6. Contact**

Contact details are available in the footer of the application interface,
including a direct email link and the github Repo for inquiries or feedback:

**📌 Notes**

All data is stored in localStorage; no internet connection or backend server is required.

This app is intended for educational and personal budgeting purposes only.

Best viewed on modern browsers (Chrome, Firefox, Edge) with JavaScript enabled.

**👩🏾‍💻👨🏼‍💻 Contributing**

Contributions, feedback, and improvements are welcome! Please fork the repository and submit a pull request with proposed changes.

Demo video below

https://www.loom.com/share/b02b56fdc0b64c219a834c07dee78a91?sid=3ee2959d-9d07-4e0f-bc30-e0babbf3cae0
