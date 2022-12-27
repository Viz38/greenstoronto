$(document).ready(function(){
	// ADD COMMAS TO VALUES
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	
	// ADVANCE OPTIONS TOGGLE
	$("#advancedQuestions").click(function(){
		if ($(this).hasClass("showingAdvanced")) {
			// hide advanced options
			$(".advancedQuestions").slideUp();
			$(this).text("Show advanced options").removeClass("showingAdvanced");
		} else {
			// show advanced options
			$(".advancedQuestions").slideDown();
			$(this).text("Hide advanced options").addClass("showingAdvanced");
		}
	});
	
	
	// CALCULATE RESULTS FUNCTION
	function calculateResults() {
		// price of house
		var housePrice = $("#housePrice").val();
		// deposit amount
		var depositAmount = $("#depositAmount").val();
		
		// calculate mortgage amount
		var mortgageAmountCalc = housePrice - depositAmount;
		// format mortgage amount
		var mortgageAmount = numberWithCommas(mortgageAmountCalc);
		// calculate mortgage LTV
		var mortgageCalc = depositAmount / housePrice;
		var mortgageCalcPer = mortgageCalc * 100;
		var mortgageLTVCalc = 100 - mortgageCalcPer;
	  	// format mortgage LTV
		var mortgageLTV = mortgageLTVCalc.toFixed(2);
		
		// calculate mortgage term in months
		var mortgageLenthYears = $("#mortgageLength").val();
		var mortgageLenthMonths = mortgageLenthYears * 12;
		
		// calculate mortgage repayments with interest
		// math taken from this excel guide: http://homeguides.sfgate.com/calculate-mortgage-payments-excel-9617.html
		var mortgageRate = $("#mortgageRate").val();
		var rateCalc = mortgageRate / 1200;
		var rateCalc2 = 1 + rateCalc;
		var rateCalc2Result = Math.pow(rateCalc2, mortgageLenthMonths);	
		
		var rateCalc3 = rateCalc * rateCalc2Result;
		var ratecalc3b = rateCalc2Result - 1;
		var rateCalc3Result = rateCalc3 / ratecalc3b;
		
		// calculate monthly rate
		var monthlyRate = rateCalc3Result * mortgageAmountCalc;
		// format monthly rate
		var finalResult = monthlyRate.toFixed(2);
		finalResult = numberWithCommas(finalResult);
		finalResult = "$" + finalResult;
		
		// calculate total repaid over the mortgage term
		var totalRepaid = monthlyRate * mortgageLenthMonths;
		// format total repaid over the mortgage term
		totalRepaid = totalRepaid.toFixed(0);
		totalRepaid = numberWithCommas(totalRepaid);
		
		// calculate deposit % or mortgage
		var depositAmt = 100 - mortgageLTV;
		// format desposit amount %
		depositAmt = depositAmt.toFixed(2);
		
		
		// main applicant salary
		var userSalary = $("#yourSalary").val();
	
		
		// INCOME TAX
		// user tax code
		var tax1060L = 10600;
		// user taxable salary
		var taxableSalary = userSalary - tax1060L;
		//alert("ap 2 Salary" + applicant2Salary + "ap 2 taxable" + ap2TaxableSalary)
		// make tax percent a decimal for calculation
		var taxTakenPercent = 20 / 100;
		// additional tax brackets
		if (taxableSalary >= 31786 && userSalary <= 150000) {
			taxTakenPercent = 40 / 100;
		} else if (taxableSalary > 150000) {
			taxTakenPercent = 45 / 100;
		}
			
		// calculate tax taken yearly
		var taxTakenAmount = taxTakenPercent * taxableSalary;
		
		// NATIONAL INSURANCE
		// national insurance threshold
		var natInsureThresh = 8060;
		// national insurance taxable
		var natInsureTaxable = userSalary - natInsureThresh;
		// make national insurance percent a decimal for calculation
		var natInsurePercent = 12 / 100;
		// calculate national insurance taken yearly
		var natInsurance = natInsurePercent * natInsureTaxable;
		// format national insurance
		natInsurance = natInsurance.toFixed(2);
		
		// cancel national insurance amount if over 65
		if ($("#over65Yes input").is(":checked")) {
			natInsurance = 0;
		}

		// take home pay yearly
		var takeHomeYear = userSalary - taxTakenAmount - natInsurance;
		
		// STUDENT LOAN REPAYMENTS
		if ($("#studentLoanYes input").is(":checked")) {
			// student loan threshold
			var studentLoanThresh = 17335;
			// student loan taxable
			var studentLoanTaxable = userSalary - studentLoanThresh;
			// make student loan percent a decimal for calculation
			var studentLoanPercent = 9 / 100;
			// calculate student loan taken yearly
			var studentLoan = studentLoanPercent * studentLoanTaxable;
			// calculate take home amount after student loan repayments
			takeHomeYear = takeHomeYear - studentLoan;
		}
		
		// yearly take home pay formatting
		takeHomeYear = takeHomeYear.toFixed(2);
		// monthly take home pay formatting
		var takeHomeMonthly = takeHomeYear / 12;
		takeHomeMonthly = takeHomeMonthly.toFixed(2);

		// SECOND APPLICANT CALCULATIONS
		if ($("#applyTwo input").is(":checked")) {
			// applicant 2 salary
			var applicant2Salary = $("#applicantTwoSalary").val();
			// applicant 2 taxable salary
			var ap2TaxableSalary = applicant2Salary - tax1060L;
			// make tax percent a decimal for calculation
			var ap2TaxTakenPercent = 20 / 100;
			// applicant 2 tax brakets
			if (ap2TaxableSalary >= 31786 && applicant2Salary <= 150000) {
				ap2TaxTakenPercent = 40 / 100;
			} else if (ap2TaxableSalary > 150000) {
				ap2TaxTakenPercent = 45 / 100;
			}
			// calculate applicant 2 tax taken yearly
			var ap2TaxTakenAmount = ap2TaxTakenPercent * ap2TaxableSalary;
			
			// NATIONAL INSURANCE
			// national insurance taxable
			var ap2NatInsureTaxable = applicant2Salary - natInsureThresh;
			// calculate national insurance taken yearly
			var ap2NatInsurance = natInsurePercent * ap2NatInsureTaxable;
			// format national insurance
			ap2NatInsurance = ap2NatInsurance.toFixed(2);
			// cancel national insurance amount if over 65
			if ($("#ap2Over65Yes input").is(":checked")) {
				ap2NatInsurance = 0;
			}
			
			// calculate yearly take home income
			var ap2TakeHomeYear = applicant2Salary - ap2TaxTakenAmount - ap2NatInsurance;
	
			// APPLICANT TWO STUDENT LOAN REPAYMENTS
			if ($("#ap2StudentLoanYes input").is(":checked")) {
				// student loan threshold
				var studentLoanThresh = 17335;
				// student loan taxable
				var ap2studentLoanTaxable = applicant2Salary - studentLoanThresh;
				// make student loan percent a decimal for calculation
				var studentLoanPercent = 9 / 100;
				// calculate student loan taken yearly
				var ap2StudentLoan = studentLoanPercent * ap2studentLoanTaxable;
				// calculate take home amount after student loan repayments
				ap2TakeHomeYear = ap2TakeHomeYear - ap2StudentLoan;
			}
			// format yearly take home income
			ap2TakeHomeYear = ap2TakeHomeYear.toFixed(2);
			
			// calculate monthly take home income
			var ap2TakeHomeMonthly = ap2TakeHomeYear / 12;
			// format monthly take home income
			ap2TakeHomeMonthly = ap2TakeHomeMonthly.toFixed(2);
			
			// work out two person app total take home income available
			var combinedSalary = Number(takeHomeMonthly) + Number(ap2TakeHomeMonthly);
		} else {
			// work out single app total take home income available
			var combinedSalary = Number(takeHomeMonthly);
		} // END SECOND APPLICANT OPTIONS
		
		// workout % of monthly take home income is taken by mortgage repayments
		var salaryPercent = Math.round(monthlyRate).toFixed(2) / combinedSalary * 100;
		salaryPercent = Math.round(salaryPercent).toFixed(0);
		
		
		// UPDATE RESULTS
		$(".results").show();
		$("#totalRepay").html("$" + totalRepaid);
		$("#finalResult").html(finalResult);
		$("#mortgageAmount").html("<strong>Mortgage Amount:</strong> $;" + mortgageAmount);
		$("#mortgageLTV").html("<strong>Mortgage LTV:</strong> " + mortgageLTV + "%");
		$("#mortgageDeposit").html("<strong>Deposit Percent:</strong>" + depositAmt + "%");
		
		// main applicant income tax math results
		$("#grossPay").html("<strong>Your Gross Pay:</strong> $" + userSalary);
		$("#taxFree").html("<strong>Your Tax Free Allowance:</strong> $" + tax1060L);
		$("#totalTaxable").html("<strong>Your Total Taxable Income:</strong> £" + taxableSalary + " | ($" + userSalary + " - $" + tax1060L + ")");
		$("#taxPaid").html("<strong>Your Tax Paid:</strong> $" + taxTakenAmount);
		$("#nationalInsurance").html("<strong>Your National Insurance Paid:</strong> $" + natInsurance);
		$("#takeHome").html("<strong>Your Yearly Take Home Pay:</strong> $" + takeHomeYear);
		$("#takeHomeMonthly").html("<strong>Monthly Take Home Pay:</strong> $" + takeHomeMonthly);
		// second applicant income tax math results
		$("#ap2GrossPay").html("<strong>App2 Gross Pay:</strong> $" + applicant2Salary);
		$("#ap2TotalTaxable").html("<strong>App2 Total Taxable Income:</strong> $" + ap2TaxableSalary + " | ($" + applicant2Salary + " - $" + tax1060L + ")");
		$("#ap2TaxPaid").html("<strong>App2 Tax Paid:</strong> $" + ap2TaxTakenAmount);
		$("#ap2NationalInsurance").html("<strong>App2 National Insurance Paid:</strong> $" + ap2NatInsurance);
		$("#ap2TakeHome").html("<strong>App2 Yearly Take Home Pay:</strong> $" + ap2TakeHomeYear);
		$("#ap2TakeHomeMonthly").html("<strong>Monthly Take Home Pay:</strong> $" + ap2TakeHomeMonthly);
	
		
		// SET RESULT TEXT BASED ON PERCENT OF SALARY
		if (salaryPercent >= 27 ) 
			{ $("#howLikely").removeClass("green amber").addClass("red").text("You are very unlikely to get this mortgage because this amount equals " + salaryPercent + "%* of your monthly income") }
		else if (salaryPercent < 27 && salaryPercent > 20 )
			{ $("#howLikely").removeClass("red green").addClass("amber").text("You may be able to get this mortgage because this amount equals " + salaryPercent + "%* of your monthly income") }
		else if (salaryPercent <= 20 )
			{ $("#howLikely").removeClass("red amber").addClass("green").text("You are more likely to get this mortgage because this amount equals " + salaryPercent + "%* of your monthly income") };
		
		
		// GENERATE DOGNUT CHART //
		var piedata = [
			{ value: mortgageLTV, color: "#e43c3c" },
			{ value: depositAmt, color: "#aacf18" }
		];
		var pieoptions = {
			segmentShowStroke : false,
			percentageInnerCutout : 60, // This is 0 for Pie charts
			animationSteps : 100,
			animationEasing : "easeOutBounce",
			animateRotate : true,
			responsive: true,
			tooltipTemplate: "<%= value %>%"
		};
		
		var c = $('#LTVChart');
		var ct = c.get(0).getContext('2d');
		var ctx = document.getElementById("LTVChart").getContext("2d");
		var myNewChart = new Chart(ct).Doughnut(piedata, pieoptions);
	} // END CALCULATE RESULTS FUNCTION
	
	
	
	
	// RADIO BUTTON SELECTION
	$(".custom-checkbox").click(function() {
		// ONE OR TWO APPLICANTS
		if ($(this).is("#applyTwo")) { 
			// show second applicant questions
			$("#applicantTwo").slideDown();
		} else if ($(this).is("#applyOne")){ 
			// hide second applicant questions
			$("#applicantTwo").slideUp();
		}
		
		// GENERAL RADIO SELECTION CODE
		var activeInput = $(this).children("input");
		if(activeInput.is(':checked')) {
			// deselect if already checked
			$(activeInput).prop("checked", false);
		} else {
			// select if not checked
			$(activeInput).prop("checked", true);
		}
		
		// REMOVE SELECTION FROM OTHER OPTIONS
		var nonActiveInput = $(this).siblings().children("input");
		$(nonActiveInput).prop("checked", false);
	}); // END RADIO BUTTON SELECTION
	
	
	
	// REMOVE ERROR CLASS ON KEYUP
	var questionInput = $(".question input")
	$(questionInput).each(function() {
		$(this).keyup(function() {
			if (!$(this).val() == "") {
				$(this).parent().removeClass("emptyInput");
			}
		});
	});
	
	
	
	// CHECK INPUTS FILLED
	function validateCalc() {
		// fix one applicant error validation
		if ($("#applyOne input").is(':checked')) {
			$("#applicantTwo input").val("0");
		}
		
		// check all questions answered
		var empty = false;
		$(questionInput).each(function() {
			if ($(this).val() == "") {
				// if not answered add error class to ".question"
				empty = true;
				$(this).parent().addClass("emptyInput");
			} else {
				// remove error class if all filled
				$(this).parent().removeClass("emptyInput");
			}
		});

		// error message control
		if (empty) {
			// show error message
			$(".errorMessage").addClass("show");
		} else {
			// hide error message and submit form calculations
			$(".errorMessage").removeClass("show");
			calculateResults();
		}
	}// END CHECK INPUTS FILLED
	
	
	// SUBMIT FORM
	$("#submitCalc").click(function(){
		validateCalc();
	});
});