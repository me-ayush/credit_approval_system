const calculateCreditScore = (customer_loans) => {
    try {
        // Initialize variables to track credit score components
        let paidOnTimeCount = 0; // Count of loans paid on time
        let totalLoansCount = customer_loans.length; // Total number of loans taken
        let currentYearLoanCount = 0; // Count of loans taken in the current year
        let totalApprovedVolume = 0; // Total approved loan volume
        let totalEMISum = 0; // Total approved loan volume
        let totalEMIpaid = 0; // Total approved loan volume
        let totalEmiExceedsLimit = false; // Flag to check if total EMI exceeds the limit
        let loanTake = false

        // Calculate the credit score components
        customer_loans.forEach((loan) => {
            loanTake = true
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
            totalEMISum += loan.emi * (loan.tenure - loan.emi_paid)

            // Component 5: Check if sum of current loans' EMI exceeds the limit
            if (totalEmiExceedsLimit) {
                return; // No need to continue checking if it's already exceeded
            }

            if (loan.emi > loan.approved_limit || totalEMISum > loan.approved_limit) {
                totalEmiExceedsLimit = true;
            }
        });

        // Calculate the credit score based on components
        let creditScore = 0;

        if (paidOnTimeCount > 0) {
            creditScore += paidOnTimeCount * 5;
        }

        if (currentYearLoanCount > 0) {
            creditScore += currentYearLoanCount * 10;
        }

        if (totalLoansCount > 0) {
            creditScore += (totalApprovedVolume / totalLoansCount) / 10000;
        }

        if (totalEmiExceedsLimit) {
            creditScore = 0; // Credit score becomes 0 if EMI exceeds the limit
        }

        if (!loanTake) {
            creditScore += 50
        }

        return Math.round(creditScore);

    } catch (error) {
        console.error('Error calculating credit score:', error);
        throw error;
    }
};

const determineLoanEligibility = (credit_score, loan_amount, interest_rate, tenure, monthly_salary, user_loan, userLoanPayments) => {
    try {
        // Initialize variables for response
        let approval = false;
        let corrected_interest_rate = null;
        let currentLoan = 0;
        let message = '';

        // Determine eligibility based on credit score
        if (credit_score >= 50) {
            approval = true;
        } else if (credit_score > 30) {
            if (interest_rate > 12) {
                approval = true;
            } else {
                corrected_interest_rate = 12;
                approval = true;
            }
        } else if (credit_score > 10) {
            if (interest_rate > 16) {
                approval = true;
            } else {
                approval = true;
                corrected_interest_rate = 16
            }
        } else {
            message = "Credit score is less than 10"
        }

        user_loan.forEach((loan) => {
            currentLoan += loan.emi * (loan.tenure - loan.emi_paid);
        })


        // Determine whether the loan can be approved based on monthly installment
        const max_monthly_installment = (0.5 * monthly_salary);
        if (currentLoan >= max_monthly_installment) {
            approval = false;
            message = "Sum of current emis is grater than your salary"
        }

        // Calculate monthly installment
        const monthly_installment = calculateMonthlyInstallment(loan_amount, corrected_interest_rate || interest_rate, tenure);

        corrected_interest_rate = corrected_interest_rate ? corrected_interest_rate : interest_rate

        return {
            approval,
            corrected_interest_rate,
            monthly_installment,
            message
        };

    } catch (error) {
        console.error('Error determining loan eligibility:', error);
        throw error;
    }
};

function calculateMonthlyInstallment(principal, annualInterestRate, tenureInMonths) {
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths)) /
        (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

    return parseFloat(emi.toFixed(2));
}

const recalculateEMI = (loanDetails, amountPaidToday, totalAmountPaid) => {
    try {
        const loanAmount = loanDetails['loan_amount'];
        const interestRate = loanDetails['interest_rate'] / 100;
        const tenureInMonths = loanDetails['tenure'];
        const emi_paid = loanDetails['emi_paid'];

        const remainingTenureInMonths = tenureInMonths - emi_paid - 1
        const monthlyInterestRate = interestRate / 12;
        const emi = loanAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -tenureInMonths)));
        const totalAmountToBePaid = emi * tenureInMonths;
        const remainingLoanAmount = totalAmountToBePaid - totalAmountPaid - amountPaidToday


        const recalculatedEMI = calculateMonthlyInstallment(remainingLoanAmount, interestRate, remainingTenureInMonths);

        return recalculatedEMI
    } catch (error) {
        throw error;
    }
}

module.exports = {
    calculateCreditScore,
    determineLoanEligibility,
    calculateMonthlyInstallment,
    recalculateEMI
};