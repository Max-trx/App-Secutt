//
// lib/lib.js
//
var Question = function (questionObj) {
  this.value = {
    text: "Question",
    answers: []
  };

  this.selectedAnswer = null;
  this.html = null;
  this.questionText = null;
  this.questionAnswers = null;
  this.questionFeedback = null;

  this.value = Object.assign(this.value, questionObj);

  this.onQuestionAnswered = ({ detail }) => {
    this.selectedAnswer = {
      value: detail.answer,
      html: detail.answerHtml
    };
    this.update();
  
    let feedbackText;
    if (detail.answer.isCorrect) {
      feedbackText = "Correct! ";
    } else {
      feedbackText = "Incorrect. ";
    }
    feedbackText += detail.answer.comment; // Ajouter le commentaire à la réponse
  
    this.questionFeedback.innerHTML = feedbackText;
  
    document.dispatchEvent(
      new CustomEvent("question-answered", {
        detail: {
          question: this,
          answer: detail.answer
        }
      })
    );
  };
  

  this.create = function () {
    this.html = document.createElement("div");
    this.html.classList.add("question");

    this.questionText = document.createElement("div");
    this.questionText.classList.add("titreQuestion");
    this.questionText.textContent = this.value.text;

    this.questionAnswers = document.createElement("div");
    this.questionAnswers.classList.add("answers");

    for (let i = 0; i < this.value.answers.length; i++) {
      const ansObj = this.value.answers[i];
      let answer = createAnswer(ansObj);

      answer.onclick = (ev) => {
        if (this.selectedAnswer !== null) {
          this.selectedAnswer.html.classList.remove("selected");
        }

        answer.classList.add("selected");

        this.html.dispatchEvent(
          new CustomEvent("question-answered", {
            detail: {
              answer: ansObj,
              answerHtml: answer
            }
          })
        );
      };

      this.questionAnswers.appendChild(answer);
    }

    this.questionFeedback = document.createElement("div");
    this.questionFeedback.classList.add("question-feedback");

    this.html.appendChild(this.questionText);
    this.html.appendChild(this.questionAnswers);
    this.html.appendChild(this.questionFeedback);

    this.html.addEventListener("question-answered", this.onQuestionAnswered);

    return this.html;
  };

  this.disable = function () {
    this.html.classList.add("disabled");
    this.html.onclick = (ev) => {
      ev.stopPropagation();
    };

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    let answers = this.html.querySelectorAll(".answer");
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      answer.onclick = null;
    }
  };

  this.remove = function () {
    let children = this.html.querySelectorAll("*");
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.html.removeChild(child);
    }

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    this.html.parentNode.removeChild(this.html);
    this.html = null;
  };

  this.update = function () {
    let correctFeedback, incorrectFeedback;
    this.html = this.html || document.createElement("div");

    correctFeedback = "Exact !";
    incorrectFeedback = "Non.";

    if (this.selectedAnswer !== null) {
      if (this.selectedAnswer.value.isCorrect) {
        this.html.classList.add("correct");
        this.html.classList.remove("incorrect");
        this.questionFeedback.innerHTML = correctFeedback;
      } else {
        this.html.classList.add("incorrect");
        this.html.classList.remove("correct");
        this.questionFeedback.innerHTML = incorrectFeedback;
      }
    }
  };

  function createAnswer(obj) {
    this.value = {
      text: "Answer",
      isCorrect: false
    };

    this.value = Object.assign(this.value, obj);

    this.html = document.createElement("button");
    this.html.classList.add("answer");

    this.html.textContent = this.value.text;

    return this.html;
  }
};

//
// main.js
//

let questionsData = [
  {
    text: "Qu'est-ce qu'un relevage d'une victime en position particulière ?",
    answers: [
      { text: "Une technique permettant de relever une victime blessée à l'aide d'un portoir souple.", isCorrect: false, comment: "Ce n'est pas la définition d'un relevage d'une victime en position particulière." },
      { text: "Une méthode de transfert d'une victime entre un brancard et un lit.", isCorrect: false, comment: "Cela ne correspond pas à la définition d'un relevage d'une victime en position particulière." },
      { text: "Une technique de relevage utilisée lorsque la victime est en position latérale de sécurité, assise, ou à plat dos avec les cuisses fléchies.", isCorrect: true, comment: "Correct, c'est la définition d'un relevage d'une victime en position particulière." },
      { text: "Une méthode de transfert d'une victime blessée vers une chaise de transport.", isCorrect: false, comment: "Ce n'est pas la définition d'un relevage d'une victime en position particulière." }
    ]
  },

  {
    text: "Quelle est la justification d'utiliser une alèse portoir dans le transfert d'une victime selon le référentiel de secourisme ?",
    answers: [
      { text: "Pour immobiliser les membres de la victime lors du transfert.", isCorrect: false, comment: "Ce n'est pas la justification d'utiliser une alèse portoir dans le transfert d'une victime." },
      { text: "Pour maintenir la victime en position latérale de sécurité pendant le transfert.", isCorrect: false, comment: "Ce n'est pas la justification d'utiliser une alèse portoir dans le transfert d'une victime." },
      { text: "Pour faciliter l'installation de la victime sur un brancard ou sur un lit en limitant les contraintes musculo-squelettiques des secouristes.", isCorrect: true, comment: "Correct, c'est la justification d'utiliser une alèse portoir dans le transfert d'une victime." },
      { text: "Pour protéger la victime des éventuels chocs pendant le transfert.", isCorrect: false, comment: "Ce n'est pas la justification d'utiliser une alèse portoir dans le transfert d'une victime." }
    ]
  },
  {
    text: "Qu'est-ce que la technique du pont simple dans le référentiel de secourisme ?",
    answers: [
      { text: "Une technique de transfert d'une victime entre un lit et un brancard.", isCorrect: false, comment: "Ce n'est pas la définition de la technique du pont simple." },
      { text: "Une méthode de relevage utilisée lorsque la victime est en position latérale de sécurité.", isCorrect: false, comment: "Cela ne correspond pas à la définition de la technique du pont simple." },
      { text: "Une méthode de relevage impliquant trois porteurs et un aide pour déplacer la victime jusqu'au brancard.", isCorrect: true, comment: "Correct, c'est la définition de la technique du pont simple." },
      { text: "Une technique de transfert d'une victime blessée vers une chaise de transport.", isCorrect: false, comment: "Ce n'est pas la définition de la technique du pont simple." }
    ]
  },
  {
    text: "Quand est-il recommandé d'utiliser une alèse portoir dans le référentiel de secourisme ?",
    answers: [
      { text: "Uniquement pour les victimes souffrant de blessures mineures.", isCorrect: false, comment: "L'utilisation d'une alèse portoir ne dépend pas seulement de la gravité des blessures." },
      { text: "Exclusivement pour le transfert des victimes vers un lit.", isCorrect: false, comment: "Une alèse portoir peut être utilisée pour d'autres types de transferts." },
      { text: "Uniquement si la victime est incapable de se déplacer seule.", isCorrect: false, comment: "L'utilisation d'une alèse portoir ne dépend pas seulement de la capacité de la victime à se déplacer." },
      { text: "Pour faciliter le transfert d'une victime sur un brancard ou sur un lit en limitant les contraintes musculo-squelettiques des secouristes.", isCorrect: true, comment: "Correct, c'est l'une des situations où l'utilisation d'une alèse portoir est recommandée." }
    ]
  },
  {
    text: "Quel est le nombre de secouristes nécessaire pour réaliser la technique de transfert par la 'cuillère' ?",
    answers: [
      { text: "Quatre secouristes.", isCorrect: false, comment: "Ce n'est pas le nombre de secouristes nécessaire pour cette technique." },
      { text: "Trois secouristes.", isCorrect: true, comment: "Correct, il faut trois secouristes pour réaliser la technique de transfert par la 'cuillère'." },
      { text: "Deux secouristes.", isCorrect: false, comment: "Ce n'est pas le nombre de secouristes nécessaire pour cette technique." },
      { text: "Cinq secouristes.", isCorrect: false, comment: "Ce n'est pas le nombre de secouristes nécessaire pour cette technique." }
    ]
  },
  {
    text: "Quelle est la caractéristique principale de la technique de transfert d'une victime à l'aide d'une alèse portoir ?",
    answers: [
      { text: "Elle nécessite un minimum de cinq secouristes pour être réalisée.", isCorrect: false, comment: "Ce n'est pas une caractéristique de cette technique." },
      { text: "Elle est utilisée uniquement pour les victimes souffrant de blessures mineures.", isCorrect: false, comment: "Ce n'est pas une caractéristique de cette technique." },
      { text: "Elle implique un roulement au sol de la victime.", isCorrect: true, comment: "Correct, c'est une caractéristique de la technique de transfert d'une victime à l'aide d'une alèse portoir." },
      { text: "Elle est contre-indiquée pour les victimes en position latérale de sécurité.", isCorrect: false, comment: "Ce n'est pas une caractéristique de cette technique." }
    ]
  },
  {
    text: "Quel est l'objectif principal du relevage d'une victime en position particulière selon le référentiel de secourisme ?",
    answers: [
      { text: "Éviter tout déplacement de la victime pendant le relevage.", isCorrect: false, comment: "Ce n'est pas l'objectif principal du relevage d'une victime en position particulière." },
      { text: "Minimiser les risques de blessures pour la victime.", isCorrect: true, comment: "Correct, l'objectif principal est de minimiser les risques de blessures pour la victime lors du relevage." },
      { text: "Accélérer le transfert de la victime vers un autre endroit.", isCorrect: false, comment: "Ce n'est pas l'objectif principal du relevage d'une victime en position particulière." },
      { text: "Assurer le confort maximal de la victime pendant le relevage.", isCorrect: false, comment: "Ce n'est pas l'objectif principal du relevage d'une victime en position particulière." }
    ]
  },
  {
    text: "Quelle est la différence entre la technique du pont simple et celle de la 'cuillère' dans le référentiel de secourisme ?",
    answers: [
      { text: "La technique du pont simple est utilisée pour les victimes en position assise, tandis que celle de la 'cuillère' est utilisée pour les victimes en position couchée.", isCorrect: false, comment: "Ce n'est pas la différence entre ces deux techniques." },
      { text: "La technique du pont simple implique trois porteurs et un aide, tandis que celle de la 'cuillère' nécessite quatre secouristes.", isCorrect: false, comment: "Ce n'est pas la différence entre ces deux techniques." },
      { text: "La technique du pont simple implique un transfert latéral de la victime jusqu'au brancard, tandis que celle de la 'cuillère' implique un transfert par rotation.", isCorrect: true, comment: "Correct, c'est la différence entre ces deux techniques." },
      { text: "La technique du pont simple est utilisée exclusivement pour les victimes en position couchée, tandis que celle de la 'cuillère' est utilisée pour les victimes en position debout.", isCorrect: false, comment: "Ce n'est pas la différence entre ces deux techniques." }
    ]
  },
  {
    text: "Quelle est la méthode utilisée pour transférer une victime du lit au brancard ou du brancard au lit selon le référentiel de secourisme ?",
    answers: [
      { text: "La technique dite de la 'cuillère'.", isCorrect: true, comment: "C'est correct, la technique de la 'cuillère' est utilisée pour ce type de transfert." },
      { text: "La méthode du 'pont simple'.", isCorrect: false, comment: "Non, cette méthode n'est pas utilisée pour ce type de transfert." },
      { text: "La technique du 'relevage classique'.", isCorrect: false, comment: "Cette méthode est utilisée pour relever une victime, mais pas pour les transferts entre lit et brancard." },
      { text: "La méthode de 'soutien partagé'.", isCorrect: false, comment: "Cette méthode n'est pas spécifique aux transferts entre lit et brancard." }
    ]
  },
  {
    text: "Qu'est-ce que l'alèse portoir utilisée dans le référentiel de secourisme ?",
    answers: [
      { text: "Une toile servant à maintenir la victime en position lors du relevage.", isCorrect: true, comment: "Exact, l'alèse portoir est une toile utilisée pour faciliter le transfert d'une victime." },
      { text: "Un dispositif de compression utilisé en cas de traumatisme.", isCorrect: false, comment: "Ce n'est pas la fonction principale de l'alèse portoir." },
      { text: "Un dispositif de ventilation utilisé en cas d'insuffisance respiratoire.", isCorrect: false, comment: "Ce n'est pas la fonction principale de l'alèse portoir." },
      { text: "Un matelas d'immobilisation utilisé en cas de fracture.", isCorrect: false, comment: "Ce n'est pas la fonction principale de l'alèse portoir." }
    ]
  },
  {
    text: "Qu'est-ce qui caractérise la technique de transfert d'une victime à l'aide d'une alèse portoir selon le référentiel de secourisme ?",
    answers: [
      { text: "Un roulement au sol de la victime.", isCorrect: true, comment: "C'est exact, cette technique implique un roulement au sol de la victime." },
      { text: "Un soulèvement de la victime par plusieurs secouristes.", isCorrect: false, comment: "Ce n'est pas la méthode utilisée lors de ce transfert." },
      { text: "Un transfert de la victime à l'aide d'un système de poulies.", isCorrect: false, comment: "Ce n'est pas la méthode décrite dans le référentiel." },
      { text: "Un déplacement de la victime à l'aide d'une civière.", isCorrect: false, comment: "Ce n'est pas la méthode décrite dans le référentiel." }
    ]
  },
  {
    text: "Quel est le rôle du secouriste 1 lors du transfert d'une victime sur une chaise de transport selon le référentiel de secourisme ?",
    answers: [
      { text: "Placer la chaise de transport à côté de la victime.", isCorrect: true, comment: "C'est correct, c'est le rôle du secouriste 1 lors de ce transfert." },
      { text: "Soutenir la tête de la victime.", isCorrect: false, comment: "Ce n'est pas le rôle principal du secouriste 1 lors de ce transfert." },
      { text: "Saisir les chevilles de la victime.", isCorrect: false, comment: "Ce n'est pas le rôle principal du secouriste 1 lors de ce transfert." },
      { text: "Assurer la stabilité de la victime pendant le transfert.", isCorrect: false, comment: "Ce n'est pas le rôle principal du secouriste 1 lors de ce transfert." }
    ]
  },
  {
    text: "Qu'est-ce qui est essentiel pour éviter tout risque lors du transfert d'une victime selon le référentiel de secourisme ?",
    answers: [
      { text: "La synchronisation et la douceur des mouvements.", isCorrect: true, comment: "Exact, la synchronisation et la douceur des mouvements sont essentielles pour éviter les risques." },
      { text: "La rapidité de la manœuvre.", isCorrect: false, comment: "La rapidité n'est pas le principal critère pour éviter les risques lors des transferts." },
      { text: "Le nombre élevé de secouristes impliqués.", isCorrect: false, comment: "Le nombre de secouristes n'est pas le principal critère pour éviter les risques lors des transferts." },
      { text: "La force physique des secouristes.", isCorrect: false, comment: "La force physique n'est pas le principal critère pour éviter les risques lors des transferts." }
    ]
  },
  {
    text: "Quelle est la principale caractéristique de la technique de transfert par la 'cuillère' selon le référentiel de secourisme ?",
    answers: [
      { text: "Elle permet de transférer une victime du lit au brancard ou du brancard au lit.", isCorrect: true, comment: "C'est exact, la technique de transfert par la 'cuillère' est utilisée pour ce type de transfert." },
      { text: "Elle nécessite un dispositif de levage spécifique.", isCorrect: false, comment: "La technique de transfert par la 'cuillère' n'a pas besoin d'un dispositif de levage spécifique." },
      { text: "Elle est utilisée exclusivement pour les victimes légères.", isCorrect: false, comment: "Elle peut être utilisée pour divers types de victimes." },
      { text: "Elle implique un roulement au sol de la victime.", isCorrect: false, comment: "Cette description correspond plutôt à la technique de transfert à l'aide d'une alèse portoir." }
    ]
  },
  {
    text: "Quel est l'objectif principal lors du transfert d'une victime selon le référentiel de secourisme ?",
    answers: [
      { text: "Minimiser les risques de blessures pour la victime et pour les secouristes.", isCorrect: true, comment: "C'est exact, la sécurité est l'objectif principal lors de tout transfert de victime." },
      { text: "Réaliser le transfert le plus rapidement possible.", isCorrect: false, comment: "La vitesse n'est pas l'objectif principal lors des transferts." },
      { text: "Utiliser un minimum de matériel pour réaliser le transfert.", isCorrect: false, comment: "La sécurité prime sur l'utilisation minimale de matériel." },
      { text: "Minimiser le nombre de secouristes impliqués dans le transfert.", isCorrect: false, comment: "La sécurité est plus importante que le nombre de secouristes." }
    ]
  },
  {
    text: "Quelle est la principale préoccupation lors du relevage d'une victime en position particulière selon le référentiel de secourisme ?",
    answers: [
      { text: "Minimiser les risques de blessures pour la victime et pour les secouristes.", isCorrect: true, comment: "C'est exact, la sécurité est la principale préoccupation lors de ce relevage." },
      { text: "Effectuer le relevage le plus rapidement possible.", isCorrect: false, comment: "La vitesse n'est pas la principale préoccupation lors de ce relevage." },
      { text: "Utiliser un minimum de matériel pour réaliser le relevage.", isCorrect: false, comment: "La sécurité prime sur l'utilisation minimale de matériel." },
      { text: "Minimiser le nombre de secouristes impliqués dans le relevage.", isCorrect: false, comment: "La sécurité est plus importante que le nombre de secouristes." }
    ]
  },
  {
    text: "Quelle est la principale caractéristique de la technique de transfert à l'aide d'une alèse portoir selon le référentiel de secourisme ?",
    answers: [
      { text: "Elle facilite le transfert d'une victime sans atteintes graves sur un brancard ou sur un lit.", isCorrect: true, comment: "C'est exact, l'alèse portoir facilite ce type de transfert." },
      { text: "Elle est utilisée exclusivement pour les victimes présentant des atteintes graves.", isCorrect: false, comment: "Elle peut être utilisée pour divers types de victimes." },
      { text: "Elle nécessite un système de poulies pour réaliser le transfert.", isCorrect: false, comment: "La technique décrite n'implique pas l'utilisation de poulies." },
      { text: "Elle est adaptée uniquement aux endroits exigus.", isCorrect: false, comment: "Elle peut être utilisée dans divers environnements." }
    ]
  },
  {
    text: "Quelle est la principale préoccupation lors du transfert d'une victime sur une chaise de transport ?",
    answers: [
      { text: "Assurer la stabilité de la victime pendant le transfert.", isCorrect: true, comment: "Exact, la principale préoccupation est de maintenir la stabilité de la victime lors de ce transfert." },
      { text: "Réduire le temps de transfert au maximum.", isCorrect: false, comment: "Ce n'est pas le principal objectif lors de ce type de transfert." },
      { text: "Minimiser le nombre de secouristes impliqués.", isCorrect: false, comment: "Ce n'est pas le principal objectif du transfert sur une chaise de transport." },
      { text: "Réduire l'encombrement de la zone d'intervention.", isCorrect: false, comment: "Ce n'est pas le principal objectif lors du transfert sur une chaise de transport." }
    ]
  },
  {
    text: "Pourquoi la technique de relevage d'une victime en position particulière est-elle utilisée ?",
    answers: [
      { text: "Elle permet de relever une victime sans risquer d'aggraver ses blessures.", isCorrect: true, comment: "Exact, cette technique est choisie pour minimiser les risques de blessures pour la victime." },
      { text: "Elle est plus rapide que d'autres techniques de relevage.", isCorrect: false, comment: "La vitesse n'est pas le principal critère de choix pour cette technique." },
      { text: "Elle nécessite moins de secouristes que d'autres techniques de relevage.", isCorrect: false, comment: "Le nombre de secouristes n'est pas le principal critère pour choisir cette technique." },
      { text: "Elle est plus adaptée aux victimes légères que d'autres techniques.", isCorrect: false, comment: "L'adéquation à la gravité des blessures est un critère, mais pas la principale raison d'utiliser cette technique." }
    ]
  }
];


// variables initialization
let questions = [];
let score = 0,
  answeredQuestions = 0;
let appContainer = document.getElementById("questions-container");
let scoreContainer = document.getElementById("score-container");
scoreContainer.innerHTML = `Score: ${score}/${5}`;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} arr items An array containing the items.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(questionsData);

// creating questions
for (var i = 0; i < 5; i++) {
  let question = new Question({
    text: questionsData[i].text,
    answers: questionsData[i].answers
  });

  appContainer.appendChild(question.create());
  questions.push(question);
}

document.addEventListener("question-answered", ({ detail }) => {
  if (detail.answer.isCorrect) {
    score++;
  }

  answeredQuestions++;
  scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
  detail.question.disable();

  if (answeredQuestions == questions.length) {
    setTimeout(function () {
      alert(`Quiz completed! \nFinal score: ${score}/${questions.length}`);
    }, 100);
  }
});

console.log(questions, questionsData);
