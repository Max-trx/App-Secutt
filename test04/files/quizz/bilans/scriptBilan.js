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
    "text": "Qu'est-ce que le bilan dans le contexte des premiers secours ?",
    "answers": [
        {
            "text": "Une évaluation globale de l'état physique uniquement de la victime.",
            "isCorrect": false,
            "comment": "Non, une évaluation globale est importante, mais le bilan comprend plus que cela."
        },
        {
            "text": "Un enregistrement des actions entreprises uniquement durant l'intervention.",
            "isCorrect": false,
            "comment": "Ce n'est pas la définition du bilan dans ce contexte."
        },
        {
            "text": "Une phase de recueil d'informations permettant d'évaluer une situation et l'état d'une victime.",
            "isCorrect": true,
            "comment": "Correct, le bilan consiste à recueillir des informations pour évaluer la situation et l'état de la victime."
        },
        {
            "text": "Un résumé des symptômes de la victime à transmettre au médecin après l'intervention.",
            "isCorrect": false,
            "comment": "Le bilan est effectué pendant l'intervention pour orienter les actions des secouristes, pas après."
        }
    ]
},
{
    "text": "Quel est l'un des objectifs principaux du bilan dans les premiers secours ?",
    "answers": [
        {
            "text": "Assurer la mise en sécurité des témoins uniquement.",
            "isCorrect": false,
            "comment": "La mise en sécurité des témoins est importante, mais ce n'est pas le seul objectif du bilan."
        },
        {
            "text": "Evaluer la situation dans sa globalité pour déceler d'éventuels dangers.",
            "isCorrect": true,
            "comment": "Oui, le bilan vise à évaluer la situation dans son ensemble pour identifier les dangers potentiels."
        },
        {
            "text": "Identifier la plainte principale de la victime dès le premier regard.",
            "isCorrect": false,
            "comment": "Ce n'est pas l'objectif principal du bilan, bien que cela puisse être important."
        },
        {
            "text": "Consigner uniquement les actions entreprises durant l'intervention.",
            "isCorrect": false,
            "comment": "Le bilan ne se limite pas à consigner les actions, mais vise à évaluer la situation et l'état de la victime."
        }
    ]
},
{
    "text": "Quel principe guide le début du bilan dans les premiers secours ?",
    "answers": [
        {
            "text": "Commencer par traiter les blessures visibles.",
            "isCorrect": false,
            "comment": "Ce n'est pas le principe de base du bilan dans ce contexte."
        },
        {
            "text": "Rechercher et traiter en priorité 'ce qui tue en premier'.",
            "isCorrect": true,
            "comment": "Oui, il est essentiel de rechercher et de traiter en priorité les situations qui menacent la vie de la victime."
        },
        {
            "text": "Commencer par un interrogatoire détaillé de la victime.",
            "isCorrect": false,
            "comment": "L'interrogatoire peut être important, mais ce n'est pas le début du bilan."
        },
        {
            "text": "Débuter par une évaluation détaillée des paramètres vitaux.",
            "isCorrect": false,
            "comment": "Les paramètres vitaux sont évalués pendant le bilan, mais ce n'est pas le début."
        }
    ]
},
{
    "text": "Quel regard du bilan se concentre sur une évaluation hiérarchisée et structurée des fonctions vitales ?",
    "answers": [
        {
            "text": "Le premier regard.",
            "isCorrect": false,
            "comment": "Non, ce regard concerne l'appréciation globale de la situation."
        },
        {
            "text": "Le deuxième regard.",
            "isCorrect": false,
            "comment": "Ce regard se concentre sur l'identification d'une menace vitale et la plainte principale."
        },
        {
            "text": "Le troisième regard.",
            "isCorrect": true,
            "comment": "Oui, le troisième regard du bilan se concentre sur une évaluation hiérarchisée des fonctions vitales."
        },
        {
            "text": "Le quatrième regard.",
            "isCorrect": false,
            "comment": "Ce regard se concentre sur l'interrogatoire approfondi et l'examen de la victime."
        }
    ]
},
{
    "text": "Que doit-on consigner et transmettre à l'équipe qui prend le relai après une intervention ?",
    "answers": [
        {
            "text": "Uniquement les actions entreprises durant l'intervention.",
            "isCorrect": false,
            "comment": "Ce n'est pas suffisant pour assurer une transition efficace."
        },
        {
            "text": "Seulement les informations sur les détresses vitales.",
            "isCorrect": false,
            "comment": "Les informations sur les détresses vitales sont importantes, mais ce n'est pas tout ce qui doit être consigné."
        },
        {
            "text": "La synthèse des informations et des actions entreprises durant toute l'intervention.",
            "isCorrect": true,
            "comment": "Oui, il est essentiel de consigner et de transmettre une synthèse complète des informations et des actions."
        },
        {
            "text": "Uniquement les paramètres vitaux mesurés pendant l'intervention.",
            "isCorrect": false,
            "comment": "Les paramètres vitaux sont importants, mais ce n'est pas tout ce qui doit être consigné."
        }
    ]
},
{
    "text": "Qu'est-ce que réalise l'équipe d'intervention lors du premier regard ?",
    "answers": [
        {
            "text": "Une évaluation détaillée de l'état de la victime.",
            "isCorrect": false,
            "comment": "Non, le premier regard consiste en une vision globale de la situation et des lieux."
        },
        {
            "text": "Une évaluation des symptômes de la victime.",
            "isCorrect": false,
            "comment": "Ce n'est pas le but du premier regard dans ce contexte."
        },
        {
            "text": "Une vision globale de la situation et des lieux d'intervention.",
            "isCorrect": true,
            "comment": "Correct, le premier regard vise à observer la scène et les circonstances de survenue."
        },
        {
            "text": "Une identification des antécédents médicaux de la victime.",
            "isCorrect": false,
            "comment": "Ce n'est pas le rôle du premier regard."
        }
    ]
},
{
    "text": "Quel est un des deux principes clés du deuxième regard dans les premiers secours ?",
    "answers": [
        {
            "text": "Observer la victime dans sa globalité.",
            "isCorrect": true,
            "comment": "Oui, lors du deuxième regard, il est essentiel d'observer la victime dans son ensemble pour évaluer son état."
        },
        {
            "text": "Se concentrer uniquement sur les menaces vitales.",
            "isCorrect": false,
            "comment": "Les menaces vitales sont importantes, mais il faut aussi observer la victime dans sa globalité."
        },
        {
            "text": "Se focaliser sur la plainte principale de la victime.",
            "isCorrect": false,
            "comment": "La plainte principale est un aspect à prendre en compte, mais ce n'est pas le seul du deuxième regard."
        },
        {
            "text": "Déterminer l'âge exact de la victime.",
            "isCorrect": false,
            "comment": "L'âge est une information importante, mais ce n'est pas le but principal du deuxième regard."
        }
    ]
},
{
    "text": "Quelle action est recommandée si la victime exprime une plainte principale lors du deuxième regard ?",
    "answers": [
        {
            "text": "Installer la victime dans une position adaptée à son état.",
            "isCorrect": true,
            "comment": "Oui, il est important d'installer la victime dans une position confortable en fonction de sa plainte principale."
        },
        {
            "text": "Demander immédiatement des moyens complémentaires.",
            "isCorrect": false,
            "comment": "C'est une action à entreprendre si nécessaire, mais ce n'est pas le premier réflexe en cas de plainte principale."
        },
        {
            "text": "Observer la victime dans sa globalité.",
            "isCorrect": false,
            "comment": "C'est une action du deuxième regard, mais ce n'est pas spécifique à une plainte principale."
        },
        {
            "text": "Rechercher une réaction anormale sans respiration.",
            "isCorrect": false,
            "comment": "C'est une action en cas de détresse vitale, mais ce n'est pas spécifique à une plainte principale."
        }
    ]
},
{
    "text": "Quel est le principe de base suivi lors de l'évaluation des fonctions vitales lors du troisième regard ?",
    "answers": [
        {
            "text": "Traiter en priorité ce qui tue en premier.",
            "isCorrect": true,
            "comment": "Oui, lors de l'évaluation des fonctions vitales, il est essentiel de traiter en priorité ce qui peut mettre la vie de la victime en danger."
        },
        {
            "text": "Evaluer d'abord la fonction cardiaque.",
            "isCorrect": false,
            "comment": "L'évaluation des fonctions vitales se fait selon un ordre spécifique, mais ce n'est pas nécessairement la fonction cardiaque en premier."
        },
        {
            "text": "Mesurer d'abord les paramètres physiologiques vitaux.",
            "isCorrect": false,
            "comment": "Les paramètres physiologiques vitaux sont mesurés après l'évaluation des fonctions vitales, ce n'est pas le principe de base du troisième regard."
        },
        {
            "text": "Demander immédiatement un avis médical en cas de détresse identifiée.",
            "isCorrect": false,
            "comment": "Demander un avis médical est important, mais ce n'est pas le principe de base de l'évaluation des fonctions vitales."
        }
    ]
},
{
    "text": "Que doit faire le secouriste dès qu'une détresse est identifiée lors de l'évaluation des fonctions vitales ?",
    "answers": [
        {
            "text": "Réaliser immédiatement les gestes de premiers secours appropriés et demander un avis médical.",
            "isCorrect": true,
            "comment": "Oui, dès qu'une détresse est identifiée, il est crucial de prendre des mesures immédiates pour sauver la vie de la victime et de demander un avis médical."
        },
        {
            "text": "Continuer l'examen de la fonction concernée avant de prendre des mesures.",
            "isCorrect": false,
            "comment": "Il est important de réagir immédiatement en cas de détresse, sans attendre la fin de l'examen de la fonction concernée."
        },
        {
            "text": "Demander à l'entourage de fournir des informations supplémentaires sur la situation.",
            "isCorrect": false,
            "comment": "C'est une bonne pratique, mais ce n'est pas la première action à entreprendre en cas de détresse identifiée."
        },
        {
            "text": "Commencer par mesurer l'ensemble des paramètres physiologiques vitaux de la victime.",
            "isCorrect": false,
            "comment": "La mesure des paramètres physiologiques vitaux est importante, mais ce n'est pas la première action à prendre en cas de détresse identifiée."
        }
    ]
},
{
    "text": "Qu'est-ce qui constitue la dernière étape du quatrième regard dans le processus d'évaluation d'une victime ?",
    "answers": [
        {
            text: "L'examen approfondi de la victime à la recherche de lésions et autres atteintes.",
            isCorrect: true,
            comment: "Oui, la dernière étape du quatrième regard implique un examen détaillé de la victime pour détecter d'éventuelles lésions ou atteintes."
        },
        {
            text: "La mesure des paramètres physiologiques vitaux.",
            isCorrect: false,
            comment: "La mesure des paramètres physiologiques est importante mais elle n'est pas la dernière étape du quatrième regard."
        },
        {
            text: "La recherche des antécédents médicaux de la victime.",
            isCorrect: false,
            comment: "C'est une partie importante du quatrième regard, mais ce n'est pas la dernière étape."
        },
        {
            text: "La transmission des éléments recueillis au médecin régulateur.",
            isCorrect: false,
            comment: "La transmission des éléments se fait à la fin, mais ce n'est pas la dernière étape du quatrième regard."
        }
    ]
},
{
    "text": "Quelle est la première étape de l'interrogatoire de la victime ou de son entourage lors du quatrième regard ?",
    "answers": [
        {
            text: "La recherche du mécanisme de l'accident, de l'évènement ou de l'histoire de la maladie.",
            isCorrect: true,
            comment: "Oui la première étape de l'interrogatoire consiste à comprendre ce qui s'est passé pour la victime ou comment la maladie est survenue.",
        },
        {
            text: "La recherche des antécédents médicaux de la victime.",
            isCorrect: false,
            comment: "C'est une étape ultérieure de l'interrogatoire, mais ce n'est pas la première."
        },
        {
            text: "L'analyse des plaintes exprimées par la victime.",
            isCorrect: false,
            comment: "C'est une partie importante de l'interrogatoire, mais ce n'est pas la première étape."
        },
        {
            text: "La mesure des paramètres physiologiques vitaux de la victime.",
            isCorrect: false,
            comment: "La mesure des paramètres physiologiques est importante mais elle intervient après cette première étape de l'interrogatoire."
        }
    ] 
},  
{
    "text": "Quel est l'objectif principal de la recherche des antécédents lors du quatrième regard ?",
    "answers": [
        {
            text: "Connaître l'état de santé préalable de la victime.",
            isCorrect: true,
            comment: "Oui, l'objectif principal de la recherche des antécédents est de comprendre l'état de santé antérieur de la victime."
        },
        {
            text: "Identifier les symptômes d'apparition récente chez la victime.",
            isCorrect: false,
            comment: "C'est une partie de l'objectif, mais ce n'est pas le principal objectif de cette recherche."
        },
        {
            text: "Déterminer les éventuelles causes de l'accident ou de la maladie.",
            isCorrect: false,
            comment: "La recherche des antécédents vise principalement à comprendre l'état de santé antérieur de la victime, pas nécessairement les causes de l'accident ou de la maladie."
        },
        {
            text: "Évaluer la sévérité des symptômes exprimés par la victime.",
            isCorrect: false,
            comment: "L'évaluation de la sévérité est importante, mais ce n'est pas l'objectif principal de la recherche des antécédents."
        }
    ]
},
{
    "text": "Quelle est la première étape de l'interrogatoire de la victime ou de son entourage lors du quatrième regard ?",
    "answers": [
        {
            text: "La recherche du mécanisme de l'accident, de l'évènement ou de l'histoire de la maladie.",
            isCorrect: true,
            comment: "Oui, la première étape de l'interrogatoire consiste à comprendre ce qui s'est passé pour la victime ou comment la maladie est survenue."
        },
        {
            text: "La recherche des antécédents médicaux de la victime.",
            isCorrect: false,
            comment: "C'est une étape ultérieure de l'interrogatoire, mais ce n'est pas la première."
        },
        {
            text: "L'analyse des plaintes exprimées par la victime.",
            isCorrect: false,
            comment: "C'est une partie importante de l'interrogatoire, mais ce n'est pas la première étape."
        },
        {
            text: "La mesure des paramètres physiologiques vitaux de la victime.",
            isCorrect: false,
            comment: "La mesure des paramètres physiologiques est importante mais elle intervient après cette première étape de l'interrogatoire."
        }
    ]
},
{
    "text": "Qu'est-ce qui constitue la dernière étape du quatrième regard dans le processus d'évaluation d'une victime ?",
    "answers": [
        {
            text: "L'examen approfondi de la victime à la recherche de lésions et autres atteintes.",
            isCorrect: true,
            comment: "Oui, la dernière étape du quatrième regard implique un examen détaillé de la victime pour détecter d'éventuelles lésions ou atteintes."
        },
        {
            text: "La mesure des paramètres physiologiques vitaux.",
            isCorrect: false,
            comment: "La mesure des paramètres physiologiques est importante mais elle n'est pas la dernière étape du quatrième regard."
        },
        {
            text: "La recherche des antécédents médicaux de la victime.",
            isCorrect: false,
            comment: "C'est une partie importante du quatrième regard, mais ce n'est pas la dernière étape."
        },
        {
            text: "La transmission des éléments recueillis au médecin régulateur.",
            isCorrect: false,
            comment: "La transmission des éléments se fait à la fin, mais ce n'est pas la dernière étape du quatrième regard."
        }
    ]
},

{
    "text": "Quand débute la surveillance de l'état de la victime selon les informations fournies ?",
    "answers": [
        {
            text: "Dès le 2ème regard.",
            isCorrect: true,
            comment: "Oui, la surveillance de l'état de la victime commence dès le 2ème regard, selon les informations fournies."
        },
        {
            text: "Dès le début de l'intervention.",
            isCorrect: false,
            comment: "Non, la surveillance ne débute pas dès le début de l'intervention mais après le 2ème regard."
        },
        {
            text: "Après la transmission de la victime à l'équipe de renfort.",
            isCorrect: false,
            comment: "Non, la surveillance débute avant la transmission de la victime à l'équipe de renfort."
        },
        {
            text: "Une fois toutes les 30 minutes.",
            isCorrect: false,
            comment: "Non, la surveillance est plus fréquente que toutes les 30 minutes, elle est constante et renouvelée régulièrement."
        }
    ]
},
{
    "text": "Quels sont les destinataires des informations concernant les changements d'état de la victime ?",
    "answers": [
        {
            text: "Le médecin régulateur, l'équipe de renfort éventuelle et l'équipe chargée d'assurer la continuité des soins.",
            isCorrect: true,
            comment: "Effectivement, les informations sur les changements d'état de la victime doivent être transmises à ces destinataires selon les informations fournies."
        },
        {
            text: "Seulement à l'équipe chargée d'assurer la continuité des soins.",
            isCorrect: false,
            comment: "Non, plusieurs destinataires doivent être informés des changements d'état de la victime."
        },
        {
            text: "Uniquement au médecin régulateur.",
            isCorrect: false,
            comment: "Non, bien que le médecin régulateur soit important, d'autres équipes doivent également être informées."
        },
        {
            text: "Il n'est pas nécessaire de transmettre ces informations.",
            isCorrect: false,
            comment: "Ce n'est pas correct, il est crucial de transmettre les informations sur les changements d'état de la victime pour assurer une prise en charge appropriée."
        }
    ]
},

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
