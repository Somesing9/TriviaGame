function Question(question, answerA, answerB, answerC, answerD, correctAnswer) {
    this.question = question;
    this.answerA = answerA;
    this.answerB = answerB;
    this.answerC = answerC;
    this.answerD = answerD;
    this.correctAnswer = correctAnswer;
    this.answerGiven = null;

    return this;
};

var theGame = {
    correct: 0, // Hold # of correct answers
    wrong: 0, // Hold # of incorrect answers
    count: 0, // Hold the # of the question we are on
    timerCount: 10, // Keeps track of the time spent on current question
    inProgress: false,
    allowAnswer: false,	// Flag to keep user from selecting multiple answers for a question
    questionTimerID: null,
    questions: new Array(),

    // buildQuestionArray: function() {
    //     this.questions[0] = new Question("The Chihuahua is a breed of dog believed to originate from what country?", "Ireland", "Scotland", "Australia", "Mexico", "D");
    //     this.questions[1] = new Question("What is a group of whales called?", "Pod", "Herd", "School", "Family", "A");
    //     this.questions[2] = new Question("What is the proper term for a group of parrots?", "Pandemonium", "Flock", "Family", "School", "A");
    // },
    buildQuestionArray: function(response) {
        for (var i = 0; i < response.length; i++) {
            var question = response[i].question;
            var answerA = response[i].correct_answer;
            var answerB = response[i].incorrect_answers[0];
            var answerC = response[i].incorrect_answers[1];
            var answerD = response[i].incorrect_answers[2];
            this.questions[i] = new Question(question, answerA, answerB, answerC, answerD, "A");
        }
        // this.questions[0] = new Question("The Chihuahua is a breed of dog believed to originate from what country?", "Ireland", "Scotland", "Australia", "Mexico", "D");
        // this.questions[1] = new Question("What is a group of whales called?", "Pod", "Herd", "School", "Family", "A");
        // this.questions[2] = new Question("What is the proper term for a group of parrots?", "Pandemonium", "Flock", "Family", "School", "A");
    },

    startGame: function() {
        // this.buildQuestionArray();
        // this.displayQuestion();
        // $("#theGame").show();
        // $("#btnStart").hide();
        this.timerCount = 10;
        $(".time-remaining").text(this.timerCount);
        this.questionTimerID = setInterval(this.updateTime, 1000);
    },

    displayQuestion: function() {
        $("#question").html(this.questions[this.count].question);
        $("#answerA").html(this.questions[this.count].answerA);
        $("#answerB").html(this.questions[this.count].answerB);
        $("#answerC").html(this.questions[this.count].answerC);
        $("#answerD").html(this.questions[this.count].answerD);
    },

    updateTime: function() {
        theGame.timerCount--;
        $(".time-remaining").text(theGame.timerCount);
        if (theGame.timerCount < 1) {
            theGame.timerCount = 10;
            theGame.checkAnswer("-1");
        }
    },

    checkAnswer: function(userGuess) {
        clearInterval(theGame.questionTimerID);

        this.questions[this.count].answerGiven = userGuess;

        if (this.questions[this.count].answerGiven === this.questions[this.count].correctAnswer) {
            // $("#answer" + userGuess).addClass("text-success");
            $("#answer" + userGuess).parent().addClass("bg-success");
            this.correct++;
            console.log("Correct: " + this.correct);
        } else {
            // $("#answer" + userGuess).addClass("text-danger");
            $("#answer" + userGuess).parent().addClass("bg-danger");
            // $("#answer" + this.questions[this.count].correctAnswer).addClass("text-success");
            $("#answer" + this.questions[this.count].correctAnswer).parent().addClass("bg-success");
            this.wrong++;
            console.log("Wrong: " + this.wrong);
        }

        window.setTimeout(function() {
            $(".answers li").each(function() {
                // $(this).removeClass("text-success text-danger");
                $(this).removeClass("bg-success bg-danger");
            });
            theGame.count++;
            if (theGame.count < theGame.questions.length) {
                theGame.displayQuestion();
                theGame.startGame();
                theGame.allowAnswer = true;
            } else {
                clearInterval(theGame.questionTimerID);
                theGame.inProgress = false;
                $("#correct").text(theGame.correct);
                $("#wrong").text(theGame.wrong);
                $("#divResults").show();
                $("#theGame").hide();


            }
        }, 2000);

    }
};

$("#btnStart").on("click", function() {
    if (theGame.count === 0) {
        // theGame.buildQuestionArray();
        getQuestions();
    }
    // theGame.inProgress = true;
    // theGame.displayQuestion();
    // theGame.startGame();
    // $("#theGame").show();
    // $("#btnStart").hide();
});

$("#btnRestart").on("click", function() {
	theGame.count = 0;
	// theGame.inProgress = true;
	getQuestions();
});

function getQuestions() {
    var queryURL = "https://opentdb.com/api.php?amount=10&type=multiple";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        console.log(response);
        theGame.buildQuestionArray(response.results);
        theGame.inProgress = true;
        theGame.allowAnswer = true;
        theGame.displayQuestion();
        theGame.startGame();
        $("#theGame").show();
        $("#btnStart").hide();
        $("#divResults").hide();
    });
}


// Function to deal with user keypress for selecting an answer
$(document).on("keyup", function(event) {
    if (theGame.inProgress && theGame.allowAnswer) {
    	theGame.allowAnswer = false;
        var keypressed = event.which;
        if (keypressed >= 65 && keypressed <= 68) {
            console.log(event.which);
            console.log(event.keyCode);
            switch (keypressed) {
                case 65:
                    theGame.checkAnswer("A");
                    break;
                case 66:
                    theGame.checkAnswer("B");
                    break;
                case 67:
                    theGame.checkAnswer("C");
                    break;
                case 68:
                    theGame.checkAnswer("D");
                    break;
            }

        } 
        else {
            console.log("invalid key press");
            console.log(keypressed);
        }
    } 
    else {
        // alert("Press start");
    }

});
