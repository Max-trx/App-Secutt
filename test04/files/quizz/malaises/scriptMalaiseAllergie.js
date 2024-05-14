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
    "text": "Quelle est la différence entre une piqûre et une morsure ?",
    "answers": [
        {
            "text": "Une piqûre concerne les atteintes provoquées par certains insectes, tandis qu'une morsure concerne les plaies provoquées par des dents ou des crochets.",
            "isCorrect": true,
            "comment": "Correct. Une piqûre implique généralement des insectes, tandis qu'une morsure implique des dents ou des crochets."
        },
        {
            "text": "Une piqûre est causée par des insectes, tandis qu'une morsure est causée par des animaux domestiques ou sauvages.",
            "isCorrect": false,
            "comment": "Incorrect. Les piqûres peuvent être causées par des insectes, mais les morsures ne sont pas limitées aux animaux domestiques ou sauvages."
        },
        {
            "text": "Une piqûre est toujours volontaire, tandis qu'une morsure peut être accidentelle ou volontaire.",
            "isCorrect": false,
            "comment": "Incorrect. Ni les piqûres ni les morsures ne sont nécessairement volontaires."
        },
        {
            "text": "Une piqûre concerne les attaques par des dents ou des crochets, tandis qu'une morsure implique une pression sur la gorge.",
            "isCorrect": false,
            "comment": "Incorrect. Cette réponse est incorrecte car elle mélange les définitions de piqûre et de morsure."
        }
    ]
},
{
    "text": "Quels sont les différents types d'animaux qui sont sources de piqûres et morsures ?",
    "answers": [
        {
            "text": "Reptiles et amphibiens",
            "isCorrect": false,
            "comment": "Incorrect. Les reptiles et les amphibiens peuvent mordre ou piquer, mais il existe d'autres types d'animaux également."
        },
        {
            "text": "Oiseaux et poissons",
            "isCorrect": false,
            "comment": "Incorrect. Bien que les oiseaux et les poissons puissent causer des blessures, d'autres types d'animaux sont également des sources de piqûres et de morsures."
        },
        {
            "text": "Mammifères, insectes, animaux marins et reptiles",
            "isCorrect": true,
            "comment": "Correct. Les mammifères, les insectes, les animaux marins et les reptiles peuvent tous causer des piqûres ou des morsures."
        },
        {
            "text": "Arachnides et insectes",
            "isCorrect": false,
            "comment": "Incorrect. Bien que les arachnides et les insectes puissent piquer, d'autres types d'animaux peuvent également causer des piqûres ou des morsures."
        }
    ]
},
{
    "text": "Quels sont les risques associés aux piqûres et morsures ?",
    "answers": [
        {
            "text": "Risque de brûlures",
            "isCorrect": false,
            "comment": "Incorrect. Les brûlures ne sont pas des risques typiques associés aux piqûres et morsures."
        },
        {
            "text": "Risque de fracture",
            "isCorrect": false,
            "comment": "Incorrect. Les fractures ne sont pas des risques typiques associés aux piqûres et morsures."
        },
        {
            "text": "Risque d'hémorragie externe, de plaie infectieuse, d'inoculation de substances toxiques et de réaction allergique grave",
            "isCorrect": true,
            "comment": "Correct. Les risques associés aux piqûres et morsures comprennent notamment l'hémorragie, les infections, l'inoculation de substances toxiques et les réactions allergiques graves."
        },
        {
            "text": "Risque de choc électrique",
            "isCorrect": false,
            "comment": "Incorrect. Le risque de choc électrique n'est pas associé aux piqûres et morsures."
        }
    ]
},
{
    "text": "Quelle est la mesure recommandée pour les morsures d'animaux suspects de rage ?",
    "answers": [
        {
            "text": "Appliquer immédiatement des compressions pour arrêter le saignement",
            "isCorrect": false,
            "comment": "Incorrect. La principale mesure recommandée est de consulter un médecin pour obtenir un vaccin antirabique."
        },
        {
            "text": "Laisser l'animal mordant en observation chez le propriétaire",
            "isCorrect": false,
            "comment": "Incorrect. La principale mesure recommandée est de consulter un médecin pour obtenir un vaccin antirabique."
        },
        {
            "text": "Consulter un médecin pour obtenir un vaccin antirabique",
            "isCorrect": true,
            "comment": "Correct. En cas de morsure par un animal suspect de rage, il est recommandé de consulter un médecin pour obtenir un vaccin antirabique."
        },
        {
            "text": "Aider la victime à s'injecter un traitement contre la rage",
            "isCorrect": false,
            "comment": "Incorrect. La vaccination contre la rage doit être administrée par un professionnel de la santé."
        }
    ]
},
{
    "text": "Quels sont les signes potentiels de piqûre ou de morsure chez une victime?",
    "answers": [
        {
            "text": "Sueur excessive et fièvre",
            "isCorrect": false,
            "comment": "Incorrect. La sueur excessive et la fièvre ne sont pas des signes typiques de piqûre ou de morsure."
        },
        {
            "text": "Perte de conscience et difficulté à respirer",
            "isCorrect": false,
            "comment": "Incorrect. Ces symptômes peuvent indiquer d'autres problèmes médicaux mais ne sont pas spécifiques aux piqûres ou morsures."
        },
        {
            "text": "Hémorragie externe et détresse respiratoire",
            "isCorrect": true,
            "comment": "Correct. L'hémorragie externe et la détresse respiratoire sont des signes potentiels de piqûre ou de morsure chez une victime."
        },
        {
            "text": "Vision floue et étourdissements",
            "isCorrect": false,
            "comment": "Incorrect. Ces symptômes peuvent indiquer d'autres problèmes médicaux mais ne sont pas spécifiques aux piqûres ou morsures."
        }
    ]
},
{
    "text": "Que doit-on faire en présence d'une piqûre d'insecte ?",
    "answers": [
        {
            "text": "Appliquer immédiatement un garrot",
            "isCorrect": false,
            "comment": "Incorrect. L'application d'un garrot n'est pas recommandée pour les piqûres d'insectes."
        },
        {
            "text": "Retirer rapidement le dard et appliquer du froid",
            "isCorrect": true,
            "comment": "Correct. Il est recommandé de retirer rapidement le dard et d'appliquer du froid pour réduire l'inflammation."
        },
        {
            "text": "Nettoyer la plaie avec de l'alcool",
            "isCorrect": false,
            "comment": "Incorrect. L'alcool peut irriter la plaie. Il est préférable de nettoyer avec de l'eau et du savon."
        },
        {
            "text": "Injecter un antidote contre les réactions allergiques",
            "isCorrect": false,
            "comment": "Incorrect. L'administration d'un antidote doit être réservée aux cas où une réaction allergique grave est présente."
        }
    ]
},
{
    "text": "Comment doit-on traiter une piqûre de méduse selon les recommandations ?",
    "answers": [
        {
            "text": "Appliquer immédiatement un pansement",
            "isCorrect": false,
            "comment": "Incorrect. L'application d'un pansement peut ne pas être suffisante pour traiter une piqûre de méduse."
        },
        {
            "text": "Arroser avec du vinaigre de table et ensuite placer la zone atteinte dans de l'eau chaude",
            "isCorrect": true,
            "comment": "Correct. L'application de vinaigre de table et d'eau chaude est une mesure recommandée pour traiter une piqûre de méduse."
        },
        {
            "text": "Utiliser un désinfectant pour nettoyer la plaie",
            "isCorrect": false,
            "comment": "Incorrect. Un désinfectant peut ne pas être suffisant pour neutraliser les toxines de la piqûre de méduse."
        },
        {
            "text": "Appliquer de la glace directement sur la piqûre",
            "isCorrect": false,
            "comment": "Incorrect. La glace peut aggraver la douleur et la brûlure causées par la piqûre de méduse."
        }
    ]
},
{
    "text": "Quelle action ne doit jamais être effectuée en cas de morsure de serpent ?",
    "answers": [
        {
            "text": "Aspiration de la plaie",
            "isCorrect": true,
            "comment": "Correct. L'aspiration de la plaie peut aggraver l'envenimation en favorisant la propagation du venin."
        },
        {
            "text": "Application d'un garrot",
            "isCorrect": false,
            "comment": "Incorrect. L'application d'un garrot peut être utile pour ralentir la propagation du venin, mais ce n'est pas la réponse spécifique à cette question."
        },
        {
            "text": "Nettoyage de la plaie avec de l'eau",
            "isCorrect": false,
            "comment": "Incorrect. Le nettoyage de la plaie est une mesure importante, mais il existe une action spécifique qui ne doit jamais être effectuée."
        },
        {
            "text": "Allongement de la victime et protection de la plaie par un pansement",
            "isCorrect": false,
            "comment": "Incorrect. Bien que cela puisse être recommandé dans certaines circonstances, il existe une action spécifique qui ne doit jamais être effectuée en cas de morsure de serpent."
        }
    ]
},
{
    "text": "Que recommande-t-on pour retirer une tique ?",
    "answers": [
        {
            "text": "Utiliser des ciseaux pour la retirer",
            "isCorrect": false,
            "comment": "Incorrect. Utiliser des ciseaux peut entraîner une pression sur la tique, ce qui peut provoquer l'injection de plus de toxines dans la plaie."
        },
        {
            "text": "Utiliser un \"tire-tique\" pour la retirer sans écraser l'animal",
            "isCorrect": true,
            "comment": "Correct. Un \"tire-tique\" est conçu pour retirer les tiques sans écraser leur corps, ce qui peut réduire le risque d'injection de toxines."
        },
        {
            "text": "Laisser la tique se détacher d'elle-même",
            "isCorrect": false,
            "comment": "Incorrect. Attendre que la tique se détache d'elle-même peut prendre du temps, pendant lequel elle peut continuer à injecter des toxines."
        },
        {
            "text": "Appliquer de la glace pour la faire partir",
            "isCorrect": false,
            "comment": "Incorrect. La glace ne fera pas partir la tique et peut même rendre plus difficile son retrait."
        }
    ]
},
{
    "text": "Pourquoi est-il important de retirer les bagues et bracelets à proximité d'une morsure ?",
    "answers": [
        {
            "text": "Pour éviter les réactions allergiques",
            "isCorrect": false,
            "comment": "Incorrect. Le retrait des bijoux n'est pas lié à la prévention des réactions allergiques."
        },
        {
            "text": "Pour faciliter le nettoyage de la plaie",
            "isCorrect": false,
            "comment": "Incorrect. Bien que le nettoyage de la plaie soit important, ce n'est pas la principale raison du retrait des bijoux."
        },
        {
            "text": "Pour éviter l'interruption de la circulation en cas de gonflement",
            "isCorrect": true,
            "comment": "Correct. En cas de gonflement, les bijoux peuvent exercer une pression supplémentaire, ce qui peut compromettre la circulation sanguine."
        },
        {
            "text": "Pour empêcher la propagation de l'infection",
            "isCorrect": false,
            "comment": "Incorrect. Le retrait des bijoux n'est pas directement lié à la prévention de l'infection."
        }
    ]
},
{
    "text": "Quelle est la première mesure recommandée en cas de contact avec la salive d'un animal errant ?",
    "answers": [
        {
            "text": "Consulter un vétérinaire",
            "isCorrect": false,
            "comment": "Incorrect. La première mesure recommandée est d'obtenir un avis médical pour évaluer le risque de transmission de maladies."
        },
        {
            "text": "Se laver immédiatement avec de l'eau",
            "isCorrect": false,
            "comment": "Incorrect. Bien que se laver après un contact avec la salive d'un animal soit important, il existe une mesure plus spécifique à prendre en premier."
        },
        {
            "text": "Demander un avis médical",
            "isCorrect": true,
            "comment": "Correct. En cas de contact avec la salive d'un animal errant, il est recommandé de consulter un médecin pour évaluer le risque de transmission de maladies."
        },
        {
            "text": "Appliquer un désinfectant sur la peau",
            "isCorrect": false,
            "comment": "Incorrect. L'application d'un désinfectant est une mesure importante mais il existe une action plus spécifique à prendre en premier."
        }
    ]
},
{
    "text": "Quelle est la procédure recommandée pour traiter une piqûre de scorpion ?",
    "answers": [
        {
            "text": "Appliquer de la glace",
            "isCorrect": false,
            "comment": "Incorrect. La glace peut ne pas être efficace pour traiter une piqûre de scorpion."
        },
        {
            "text": "Aspirer le venin",
            "isCorrect": false,
            "comment": "Incorrect. L'aspiration du venin peut aggraver la plaie en favorisant la propagation du venin."
        },
        {
            "text": "Placer la zone atteinte dans de l'eau chaude",
            "isCorrect": true,
            "comment": "Correct. Placer la zone affectée dans de l'eau chaude peut aider à soulager la douleur causée par la piqûre de scorpion."
        },
        {
            "text": "Appliquer un bandage serré autour de la plaie",
            "isCorrect": false,
            "comment": "Incorrect. Un bandage serré peut aggraver la douleur et augmenter le risque d'infection."
        }
    ]
},
{
    "text": "Quelle est la démarche à suivre en présence d'une morsure d'origine ?",
    "answers": [
        {
            "text": "Nettoyer la plaie avec de l'alcool",
            "isCorrect": false,
            "comment": "Incorrect. L'alcool peut irriter la plaie. Il est préférable de nettoyer avec de l'eau et du savon."
        },
        {
            "text": "Appliquer un pansement et surveiller l'état de la plaie",
            "isCorrect": false,
            "comment": "Incorrect. Bien qu'il soit important de surveiller l'état de la plaie, il existe une action spécifique à prendre en premier."
        },
        {
            "text": "Consulter immédiatement un médecin",
            "isCorrect": true,
            "comment": "Correct. En cas de morsure, il est recommandé de consulter immédiatement un médecin pour évaluer le risque d'infection et de transmission de maladies."
        },
        {
            "text": "Appliquer de la glace pour réduire l'inflammation",
            "isCorrect": false,
            "comment": "Incorrect. L'application de glace peut aider à réduire l'inflammation, mais il existe une action plus spécifique à prendre en premier."
        }
    ]
},
{
    "text": "Quelle est la recommandation en cas de persistance de la douleur ou du gonflement après une piqûre d'insecte ?",
    "answers": [
        {
            "text": "Appliquer une crème antiseptique",
            "isCorrect": false,
            "comment": "Incorrect. Une crème antiseptique peut ne pas être suffisante pour traiter la douleur persistante ou le gonflement après une piqûre d'insecte."
        },
        {
            "text": "Prendre des médicaments anti-inflammatoires",
            "isCorrect": false,
            "comment": "Incorrect. Bien que les anti-inflammatoires puissent être utiles, il existe une recommandation plus spécifique."
        },
        {
            "text": "Consulter un médecin",
            "isCorrect": true,
            "comment": "Correct. En cas de douleur ou de gonflement persistants après une piqûre d'insecte, il est recommandé de consulter un médecin pour évaluer la nécessité d'un traitement supplémentaire."
        },
        {
            "text": "Appliquer de la glace pendant plusieurs heures",
            "isCorrect": false,
            "comment": "Incorrect. Bien que l'application de glace puisse réduire l'inflammation, il existe une recommandation plus spécifique en cas de douleur ou de gonflement persistants."
        }
    ]
},

{
"text": "16. Quel est le principal risque associé à une plaie par piqûre d'insecte ?",
"answers": [
    {
        "text": "a) Une brûlure chimique",
        "isCorrect": false,
        "comment": "Incorrect. Les piqûres d'insectes ne sont généralement pas associées à des brûlures chimiques."
    },
    {
        "text": "b) Une infection de la plaie",
        "isCorrect": true,
        "comment": "Correct. Les piqûres d'insectes peuvent entraîner une infection de la plaie, en particulier si elles ne sont pas correctement nettoyées et traitées."
    },
    {
        "text": "c) Une fracture",
        "isCorrect": false,
        "comment": "Incorrect. Une piqûre d'insecte ne provoque généralement pas de fracture, sauf dans des circonstances très inhabituelles."
    },
    {
        "text": "d) Une déshydratation",
        "isCorrect": false,
        "comment": "Incorrect. La déshydratation n'est pas un risque courant associé aux piqûres d'insectes."
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
