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
    text: "Quels sont les types d'accidents pouvant entraîner une situation à nombreuses victimes selon le référentiel de secourisme ?",
    answers: [
      { text: "Accidents de trafic, incendies, effondrements de structures, accidents sociaux, actes de terrorisme, catastrophes naturelles limitées, catastrophes technologiques, accidents infectieux.", isCorrect: true, comment: "Correct, ces sont les différents types d'accidents énumérés dans le référentiel." },
      { text: "Uniquement les accidents de trafic.", isCorrect: false, comment: "Il existe d'autres types d'accidents pouvant entraîner une situation à nombreuses victimes." },
      { text: "Uniquement les accidents de travail.", isCorrect: false, comment: "Les accidents de travail ne sont pas les seuls à entraîner des situations à nombreuses victimes." },
      { text: "Uniquement les catastrophes naturelles.", isCorrect: false, comment: "Les situations à nombreuses victimes ne sont pas limitées aux catastrophes naturelles." }
    ]
  },
  {
    text: "Quelles sont les conséquences caractérisant un accident entraînant de nombreuses victimes selon le référentiel de secourisme ?",
    answers: [
      { text: "La présence de dégâts matériels importants uniquement.", isCorrect: false, comment: "Les conséquences d'un accident à nombreuses victimes sont plus larges que seulement les dégâts matériels." },
      { text: "La présence de nombreuses victimes réelles ou potentielles, des dégâts matériels importants, une inadéquation initiale et temporaire entre les moyens disponibles et les besoins.", isCorrect: true, comment: "Correct, ces éléments caractérisent les conséquences d'un tel accident." },
      { text: "Uniquement la présence de nombreuses victimes réelles.", isCorrect: false, comment: "Les conséquences d'un tel accident vont au-delà de la présence de victimes." },
      { text: "Uniquement la présence de dégâts matériels importants et une inadéquation des moyens.", isCorrect: false, comment: "Cela ne couvre pas toutes les conséquences d'un accident à nombreuses victimes." }
    ]
  },
  {
    text: "Quels sont les principes d'action de secours recommandés dans une situation à nombreuses victimes ?",
    answers: [
      { text: "Assurer uniquement la sécurité et procéder rapidement à l'évacuation des victimes.", isCorrect: false, comment: "Il y a d'autres principes d'action à considérer." },
      { text: "Procéder à une reconnaissance rapide du site, assurer la sécurité, transmettre sans délai les informations recueillies, procéder au repérage des nombreuses victimes, réaliser les gestes de secours les plus urgents.", isCorrect: true, comment: "Correct, ces principes d'action sont recommandés dans une situation à nombreuses victimes." },
      { text: "Attendre l'arrivée des secours spécialisés sans intervenir.", isCorrect: false, comment: "Il est important d'agir rapidement en cas de situation à nombreuses victimes." },
      { text: "Procéder directement au sauvetage des victimes sans évaluer les dangers.", isCorrect: false, comment: "Assurer la sécurité est une priorité avant d'agir." }
    ]
  },
  {
    text: "Quel est le rôle des secouristes vis-à-vis des personnes non blessées mais affectées psychologiquement lors d'une situation à nombreuses victimes ?",
    answers: [
      { text: "Ne pas intervenir car ils ne sont pas blessés physiquement.", isCorrect: false, comment: "Les secouristes peuvent apporter un soutien aux personnes affectées psychologiquement." },
      { text: "Les diriger immédiatement vers les équipes spécialisées en psychologie.", isCorrect: false, comment: "Les secouristes peuvent également apporter un premier soutien psychologique." },
      { text: "Les regrouper au sein d'une zone dédiée aux impliqués et leur apporter une écoute réconfortante.", isCorrect: true, comment: "Correct, les secouristes peuvent jouer un rôle crucial dans le soutien psychologique des personnes affectées." },
      { text: "Les laisser se débrouiller seules.", isCorrect: false, comment: "Il est important d'offrir un soutien aux personnes affectées, même si elles ne sont pas blessées physiquement." }
    ]
  },
  {
    text: "Quelles sont les caractéristiques des dégâts matériels dans un accident entraînant de nombreuses victimes ?",
    answers: [
      { text: "Ils touchent principalement les bâtiments administratifs.", isCorrect: false, comment: "Les dégâts matériels peuvent affecter divers types de structures." },
      { text: "Ils peuvent engendrer des risques persistants pour les secouristes.", isCorrect: true, comment: "Correct, les dégâts matériels peuvent présenter des risques pour les secouristes." },
      { text: "Ils sont généralement limités aux véhicules.", isCorrect: false, comment: "Les dégâts matériels ne se limitent pas aux véhicules." },
      { text: "Ils n'ont pas d'impact sur les opérations de secours.", isCorrect: false, comment: "Les dégâts matériels peuvent influencer les opérations de secours." }
    ]
  },
  {
    text: "Quel est l'impact des dégâts matériels sur le sauvetage des victimes lors d'un accident à nombreuses victimes ?",
    answers: [
      { text: "Ils n'ont aucun impact sur le sauvetage des victimes.", isCorrect: false, comment: "Les dégâts matériels peuvent affecter le sauvetage des victimes." },
      { text: "Ils facilitent le sauvetage des victimes en fournissant des accès plus aisés.", isCorrect: false, comment: "Les dégâts matériels peuvent compliquer le sauvetage des victimes." },
      { text: "Ils peuvent avoir un impact sur le sauvetage des victimes en rendant l'accès difficile et en influençant la nature des gestes de secours à réaliser.", isCorrect: true, comment: "Correct, les dégâts matériels peuvent compliquer les opérations de secours." },
      { text: "Ils accélèrent le sauvetage des victimes en rendant l'intervention des secouristes plus efficace.", isCorrect: false, comment: "Les dégâts matériels peuvent ralentir le sauvetage des victimes en rendant l'accès plus difficile." }
    ]
  },
  {
    text: "Quelle est l'importance de l'organisation des secours dans une situation à nombreuses victimes ?",
    answers: [
      { text: "Elle n'est pas importante, car chaque secouriste peut agir individuellement.", isCorrect: false, comment: "Une organisation efficace des secours est cruciale dans ce type de situation." },
      { text: "Elle permet de limiter les effets du sinistre en coordonnant les interventions et en optimisant les ressources disponibles.", isCorrect: true, comment: "Correct, une bonne organisation des secours est essentielle pour gérer efficacement une situation à nombreuses victimes." },
      { text: "Elle ne concerne que les secours professionnels, pas les secouristes volontaires.", isCorrect: false, comment: "Tous les intervenants, qu'ils soient professionnels ou volontaires, doivent être intégrés dans l'organisation des secours." },
      { text: "Elle n'est importante que pour les autorités compétentes, pas pour les secouristes sur le terrain.", isCorrect: false, comment: "Les secouristes sur le terrain doivent également comprendre et respecter l'organisation des secours." }
    ]
  },
  {
    text: "Quelles sont les caractéristiques des victimes dans une situation à nombreuses victimes selon le référentiel de secourisme ?",
    answers: [
      { text: "Elles sont toutes blessées de manière visible.", isCorrect: false, comment: "Les victimes peuvent avoir des blessures visibles ou non." },
      { text: "Certaines peuvent être accessibles immédiatement, d'autres peuvent être enfouies ou emprisonnées.", isCorrect: true, comment: "Correct, les victimes peuvent présenter une variété de situations d'accessibilité." },
      { text: "Toutes présentent des blessures internes dues à une explosion.", isCorrect: false, comment: "Les blessures des victimes peuvent avoir différentes origines." },
      { text: "Elles sont toutes dans un état de choc psychologique sévère.", isCorrect: false, comment: "Le choc psychologique peut varier d'une victime à l'autre." }
    ]
  },
  {
    text: "Quel est le rôle des secouristes vis-à-vis des victimes en arrêt cardiaque ou décédées lors d'une situation à nombreuses victimes ?",
    answers: [
      { text: "Les ignorer car ils sont focalisés sur le sauvetage des victimes vivantes.", isCorrect: false, comment: "Les secouristes doivent également prendre en compte les victimes en arrêt cardiaque ou décédées." },
      { text: "Les traiter en priorité car leur état est plus grave que celui des autres victimes.", isCorrect: false, comment: "Les secouristes doivent prioriser les interventions en fonction de la gravité des blessures." },
      { text: "Les prendre en charge selon les protocoles appropriés et les dégager si possible pour libérer les ressources médicales.", isCorrect: true, comment: "Correct, les secouristes doivent suivre les protocoles pour les victimes en arrêt cardiaque ou décédées." },
      { text: "Attendre l'arrivée des services de secours spécialisés avant d'intervenir.", isCorrect: false, comment: "Les secouristes doivent agir rapidement pour prendre en charge toutes les victimes." }
    ]
  },
  {
    text: "Quelle est l'importance de la reconnaissance rapide du site dans une situation à nombreuses victimes ?",
    answers: [
      { text: "Elle permet d'évaluer la gravité des blessures des victimes.", isCorrect: false, comment: "La reconnaissance du site ne concerne pas directement l'évaluation des blessures des victimes." },
      { text: "Elle permet de repérer les victimes plus rapidement.", isCorrect: true, comment: "Correct, une reconnaissance rapide du site permet d'identifier les zones les plus critiques et d'optimiser les interventions." },
      { text: "Elle n'est pas importante car les secouristes doivent agir immédiatement.", isCorrect: false, comment: "Une reconnaissance rapide du site est essentielle pour planifier et prioriser les interventions." },
      { text: "Elle permet d'identifier les causes de l'accident.", isCorrect: false, comment: "La reconnaissance du site vise principalement à évaluer la situation et à planifier les interventions." }
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
