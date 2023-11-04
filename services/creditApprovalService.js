

const calculateCreditScore = (customer_loans) => {
    try {
        // Initialize variables to track credit score components
        let paidOnTimeCount = 0; // Count of loans paid on time
        let totalLoansCount = customer_loans.length; // Total number of loans taken
        let currentYearLoanCount = 0; // Count of loans taken in the current year
        let totalApprovedVolume = 0; // Total approved loan volume
        let totalEmiExceedsLimit = false; // Flag to check if total EMI exceeds the limit

        // Calculate the credit score components
        customer_loans.forEach((loan) => {
            // Component 1: Past Loans paid on time
            if (loan.emi_paid === loan.tenure) {
                paidOnTimeCount++;
            }

            // Component 3: Loan activity in the current year
            const currentYear = new Date().getFullYear();
            const loanYear = new Date(loan.start_date).getFullYear();
            if (loanYear === currentYear) {
                currentYearLoanCount++;
            }

            // Component 4: Loan approved volume
            totalApprovedVolume += loan.loan_amount;

            // Component 5: Check if sum of current loans' EMI exceeds the limit
            if (totalEmiExceedsLimit) {
                return; // No need to continue checking if it's already exceeded
            }

            if (loan.emi > loan.approved_limit) {
                totalEmiExceedsLimit = true;
            }
        });

        // Calculate the credit score based on components
        let creditScore = 0;

        if (paidOnTimeCount > 0) {
            creditScore += paidOnTimeCount * 5; // Adjust as needed
        }

        if (currentYearLoanCount > 0) {
            creditScore += currentYearLoanCount * 10; // Adjust as needed
        }

        if (totalLoansCount > 0) {
            creditScore += (totalApprovedVolume / totalLoansCount) / 10000; // Adjust as needed
        }

        if (totalEmiExceedsLimit) {
            creditScore = 0; // Credit score becomes 0 if EMI exceeds the limit
        }

        return Math.round(creditScore);

    } catch (error) {
        console.error('Error calculating credit score:', error);
        throw error;
    }
};

const determineLoanEligibility = (credit_score, loan_amount, interest_rate, tenure, monthly_salary) => {
    try {
        // Initialize variables for response
        let approval = false;
        let corrected_interest_rate = null;

        // Determine eligibility based on credit score
        if (credit_score > 50) {
            approval = true;
        } else if (credit_score > 30) {
            if (interest_rate > 12) {
                approval = true;
            } else {
                corrected_interest_rate = 12; // Correct the interest rate
            }
        } else if (credit_score > 10) {
            if (interest_rate > 16) {
                approval = true;
            } else {
                corrected_interest_rate = 16; // Correct the interest rate
            }
        }

        // Calculate monthly installment
        const monthly_installment = calculateMonthlyInstallment(loan_amount, corrected_interest_rate || interest_rate, tenure);

        // Determine whether the loan can be approved based on monthly installment
        const max_monthly_installment = (0.5 * monthly_salary) / 100; // Assuming monthly_income is available
        if (monthly_installment <= max_monthly_installment) {
            approval = false;
        }

        // Create the response object
        corrected_interest_rate = corrected_interest_rate ? corrected_interest_rate : interest_rate
        return {
            approval,
            corrected_interest_rate,
            monthly_installment,
        };

    } catch (error) {
        console.error('Error determining loan eligibility:', error);
        throw error;
    }
};

const calculateMonthlyInstallment = (principal, annualInterestRate, tenureInMonths) => {
    // Convert annual interest rate to monthly rate and ensure it's a decimal
    const monthlyInterestRate = (annualInterestRate / 12) / 100;

    // Calculate EMI using the formula
    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

    return emi;
};

module.exports = {
    calculateCreditScore,
    determineLoanEligibility,
    calculateMonthlyInstallment
};