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
    "text": "Quelle est la définition de l'accouchement inopiné ?",
    "answers": [
        {
            "text": "Un accouchement qui se déroule dans une maternité.",
            "isCorrect": false,
            "comment": "Incorrect. L'accouchement inopiné se produit avant l'arrivée des secours."
        },
        {
            "text": "Un accouchement qui se déroule avant l'arrivée des secours.",
            "isCorrect": true,
            "comment": "Correct. L'accouchement inopiné se produit avant l'arrivée des secours."
        },
        {
            "text": "Un accouchement qui se déroule après l'arrivée des secours.",
            "isCorrect": false,
            "comment": "Incorrect. L'accouchement inopiné se produit avant l'arrivée des secours."
        },
        {
            "text": "Un accouchement qui se déroule dans une maternité mais sans assistance médicale.",
            "isCorrect": false,
            "comment": "Incorrect. Cette réponse ne définit pas correctement l'accouchement inopiné."
        }
    ]
},



{
    "text": "À quelle semaine de grossesse l'accouchement se produit-il en moyenne ?",
    "answers": [
        {
            "text": "36 semaines.",
            "isCorrect": false,
            "comment": "Incorrect. L'accouchement moyen se produit plus tard dans la grossesse."
        },
        {
            "text": "38 semaines.",
            "isCorrect": false,
            "comment": "Incorrect. L'accouchement moyen se produit plus tard dans la grossesse."
        },
        {
            "text": "39 semaines.",
            "isCorrect": true,
            "comment": "Correct. L'accouchement moyen se produit en moyenne autour de la 39e semaine de grossesse."
        },
        {
            "text": "42 semaines.",
            "isCorrect": false,
            "comment": "Incorrect. 42 semaines est considérée comme une grossesse prolongée."
        }
    ]
},

{
    "text": "Quelle est la première étape de l'accouchement ?",
    "answers": [
        {
            "text": "Le travail.",
            "isCorrect": true,
            "comment": "Correct. Le travail est la première étape de l'accouchement, marqué par les contractions utérines."
        },
        {
            "text": "L'expulsion.",
            "isCorrect": false,
            "comment": "Incorrect. L'expulsion est la deuxième étape de l'accouchement."
        },
        {
            "text": "La délivrance.",
            "isCorrect": false,
            "comment": "Incorrect. La délivrance est la troisième étape de l'accouchement."
        },
        {
            "text": "La contraction.",
            "isCorrect": false,
            "comment": "Incorrect. La contraction est une partie du processus du travail."
        }
    ]
},


{
    "text": "Qu'est-ce que la rupture de la poche des eaux ?",
    "answers": [
        {
            "text": "La sortie de glaires sanguinolentes.",
            "isCorrect": false,
            "comment": "Incorrect. La rupture des eaux implique la libération d'un liquide clair."
        },
        {
            "text": "La sortie d'un liquide clair.",
            "isCorrect": true,
            "comment": "Correct. La rupture de la poche des eaux implique la libération d'un liquide clair."
        },
        {
            "text": "L'ouverture de l'utérus.",
            "isCorrect": false,
            "comment": "Incorrect. La rupture de la poche des eaux précède généralement l'ouverture complète du col de l'utérus."
        },
        {
            "text": "La contraction de l'utérus.",
            "isCorrect": false,
            "comment": "Incorrect. La rupture de la poche des eaux n'est pas une contraction de l'utérus."
        }
    ]
},

{
    "text": "Quelle est la deuxième étape de l'accouchement ?",
    "answers": [
        {
            "text": "Le travail.",
            "isCorrect": false,
            "comment": "Incorrect. Le travail est la première étape de l'accouchement."
        },
        {
            "text": "L'expulsion.",
            "isCorrect": true,
            "comment": "Correct. L'expulsion est la deuxième étape de l'accouchement, où le bébé est poussé hors de l'utérus."
        },
        {
            "text": "La délivrance.",
            "isCorrect": false,
            "comment": "Incorrect. La délivrance est la troisième étape de l'accouchement."
        },
        {
            "text": "La contraction.",
            "isCorrect": false,
            "comment": "Incorrect. La contraction est une partie du processus du travail."
        }
    ]
},


{
    "text": "Comment se déroule l'expulsion pendant l'accouchement ?",
    "answers": [
        {
            "text": "La mère pousse vers le haut.",
            "isCorrect": false,
            "comment": "Incorrect. Pendant l'expulsion, la mère pousse généralement vers le bas."
        },
        {
            "text": "La mère pousse vers le bas.",
            "isCorrect": true,
            "comment": "Correct. Pendant l'expulsion, la mère pousse généralement vers le bas pour aider le bébé à sortir."
        },
        {
            "text": "La mère pousse sur le côté.",
            "isCorrect": false,
            "comment": "Incorrect. La poussée vers le côté n'est pas une méthode typique pendant l'expulsion."
        },
        {
            "text": "La mère ne pousse pas.",
            "isCorrect": false,
            "comment": "Incorrect. Pendant l'expulsion, la mère est généralement encouragée à pousser pour aider le bébé à sortir."
        }
    ]
},


{
    "text": "Qu'est-ce que la délivrance ?",
    "answers": [
        {
            "text": "La sortie du bébé de l'utérus.",
            "isCorrect": false,
            "comment": "Incorrect. La délivrance ne concerne pas la sortie du bébé, mais plutôt l'expulsion du placenta."
        },
        {
            "text": "La sortie de la poche des eaux.",
            "isCorrect": false,
            "comment": "Incorrect. La délivrance ne concerne pas la sortie de la poche des eaux, mais plutôt l'expulsion du placenta."
        },
        {
            "text": "La sortie du placenta de l'utérus.",
            "isCorrect": true,
            "comment": "Correct. La délivrance est la troisième étape de l'accouchement, impliquant l'expulsion du placenta de l'utérus après la naissance du bébé."
        },
        {
            "text": "La sortie des contractions.",
            "isCorrect": false,
            "comment": "Incorrect. La délivrance n'est pas la sortie des contractions, mais plutôt l'expulsion du placenta."
        }
    ]
},

{
    "text": "Quels sont les signes de l'accouchement imminant ?",
    "answers": [
        {
            "text": "La perte de connaissance.",
            "isCorrect": false,
            "comment": "Incorrect. La perte de connaissance n'est pas un signe d'accouchement imminent."
        },
        {
            "text": "Les contractions utérines.",
            "isCorrect": true,
            "comment": "Correct. Les contractions utérines sont un signe d'accouchement imminent, indiquant que le travail a commencé."
        },
        {
            "text": "La perte de liquide amniotique.",
            "isCorrect": false,
            "comment": "Incorrect. La perte de liquide amniotique est un signe de rupture de la poche des eaux, mais pas nécessairement un signe d'accouchement imminent."
        },
        {
            "text": "Les convulsions.",
            "isCorrect": false,
            "comment": "Incorrect. Les convulsions ne sont pas un signe d'accouchement imminent."
        }
    ]
},

{
    "text": "Que doit-on faire si le transport de la parturiente peut être réalisé ?",
    "answers": [
        {
            "text": "Réaliser l'accouchement sur place.",
            "isCorrect": false,
            "comment": "Incorrect. Si le transport est possible, la parturiente devrait être transportée vers une installation médicale appropriée pour l'accouchement."
        },
        {
            "text": "Demander une équipe médicale.",
            "isCorrect": false,
            "comment": "Incorrect. Demander une équipe médicale peut être nécessaire, mais la priorité est de transporter la parturiente vers une installation médicale appropriée pour l'accouchement."
        },
        {
            "text": "Installer la parturiente sur un brancard la tête à la place habituelle des pieds.",
            "isCorrect": true,
            "comment": "Correct. Lorsque le transport est possible, la parturiente doit être installée sur un brancard avec la tête à la place habituelle des pieds pour prévenir l'aspiration du liquide amniotique ou des sécrétions."
        },
        {
            "text": "Surveiller la parturiente durant le transport.",
            "isCorrect": true,
            "comment": "Correct. Pendant le transport, la parturiente doit être surveillée attentivement pour détecter tout signe de complication."
        }
    ]
},

{
    "text": "Quel est le matériel nécessaire pour l'accouchement sur place ?",
    "answers": [
        {
            "text": "Un materkit.",
            "isCorrect": true,
            "comment": "Incorrect. Le terme exact est 'matériel médical d'urgence'."
        },
        {
            "text": "Des pansements.",
            "isCorrect": false,
            "comment": "Incorrect. Les pansements ne sont généralement pas nécessaires lors de l'accouchement."
        },
        {
            "text": "Des serviettes de bain propres et sèches.",
            "isCorrect": true,
            "comment": "Correct. Des serviettes de bain propres et sèches peuvent être utilisées pour maintenir l'hygiène pendant l'accouchement sur place."
        },
        {
            "text": "Des bandages.",
            "isCorrect": false,
            "comment": "Incorrect. Les bandages ne sont généralement pas nécessaires lors de l'accouchement, sauf en cas de saignement excessif."
        }
    ]
},

{
    "text": "Quelle est la position recommandée pour la parturiente lors de l'accouchement sur place ?",
    "answers": [
        {
            "text": "Allongée sur le dos.",
            "isCorrect": false,
            "comment": "Incorrect. La position allongée sur le dos n'est pas recommandée pour l'accouchement, car elle peut comprimer les vaisseaux sanguins et réduire l'afflux sanguin vers l'utérus."
        },
        {
            "text": "Assise.",
            "isCorrect": false,
            "comment": "Incorrect. La position assise peut être inconfortable et ne facilite pas l'expulsion du bébé."
        },
        {
            "text": "Debout.",
            "isCorrect": false,
            "comment": "Incorrect. La position debout peut être difficile à maintenir pendant l'accouchement et ne favorise pas l'expulsion du bébé."
        },
        {
            "text": "Demi-assise, cuisses fléchies et écartées.",
            "isCorrect": true,
            "comment": "Correct. Cette position facilite l'ouverture du bassin et l'expulsion du bébé pendant l'accouchement sur place."
        }
    ]
},

{
    "text": "Comment doit-on aider la mère pendant l'accouchement ?",
    "answers": [
        {
            "text": "En la laissant seule.",
            "isCorrect": false,
            "comment": "Incorrect. Pendant l'accouchement, la mère a besoin de soutien et d'encouragement."
        },
        {
            "text": "En lui demandant de pousser vers le bas lors des contractions.",
            "isCorrect": true,
            "comment": "Correct. Encourager la mère à pousser vers le bas pendant les contractions peut aider à expulser le bébé."
        },
        {
            "text": "En lui donnant à boire.",
            "isCorrect": false,
            "comment": "Incorrect. Il est important de maintenir la mère hydratée pendant l'accouchement, mais cela ne constitue pas une aide principale pendant l'expulsion du bébé."
        },
        {
            "text": "En la plaçant sur le ventre.",
            "isCorrect": false,
            "comment": "Incorrect. La position sur le ventre n'est généralement pas recommandée pendant l'accouchement, car elle peut entraver la respiration de la mère."
        }
    ]
},

{
    "text": "Que doit-on faire dès que la moitié de la tête du bébé est apparue ?",
    "answers": [
        {
            "text": "Faire sortir rapidement le bébé.",
            "isCorrect": false,
            "comment": "Incorrect. Il est important de procéder avec prudence et de ne pas précipiter l'accouchement, surtout si le professionnel de santé n'est pas présent."
        },
        {
            "text": "Cesser de faire pousser la mère.",
            "isCorrect": true,
            "comment": "Correct. Il est essentiel de cesser de faire pousser la mère dès que la tête du bébé commence à sortir pour éviter les déchirures du périnée."
        },
        {
            "text": "Faire une incision.",
            "isCorrect": false,
            "comment": "Incorrect. Faire une incision n'est généralement pas nécessaire et ne doit être effectué que par du personnel médical qualifié dans des situations spécifiques."
        },
        {
            "text": "Demander un avis médical.",
            "isCorrect": false,
            "comment": "Incorrect. Si le professionnel de santé n'est pas déjà présent, il peut être difficile de solliciter un avis médical immédiat dans ce cas. Cesser de faire pousser la mère est la meilleure action à entreprendre dans l'immédiat."
        }
    ]
},


{
    "text": "Quelle est la dernière étape de l'accouchement inopiné ?",
    "answers": [
        {
            "text": "L'expulsion.",
            "isCorrect": false,
            "comment": "Incorrect. L'expulsion est la deuxième étape de l'accouchement. La dernière étape est la délivrance, qui consiste en l'expulsion du placenta."
        },
        {
            "text": "La délivrance.",
            "isCorrect": true,
            "comment": "Correct. La délivrance est la dernière étape de l'accouchement inopiné, impliquant l'expulsion du placenta de l'utérus après la naissance du bébé."
        },
        {
            "text": "L'administration de médicaments.",
            "isCorrect": false,
            "comment": "Incorrect. L'administration de médicaments peut être nécessaire à différents moments de l'accouchement, mais ce n'est pas la dernière étape."
        },
        {
            "text": "Le transport à l'hôpital.",
            "isCorrect": false,
            "comment": "Incorrect. Le transport à l'hôpital peut être effectué après la délivrance, mais ce n'est pas la dernière étape de l'accouchement lui-même."
        }
    ]
},

{
    "text": "Quelle est la méthode recommandée pour aider la future maman à pousser pendant l'accouchement ?",
    "answers": [
        {
            "text": "Lui demander de retenir sa respiration et de pousser vers le haut.",
            "isCorrect": false,
            "comment": "Incorrect. Retenir sa respiration et pousser vers le haut n'est pas une méthode recommandée, car cela peut augmenter la pression intra-abdominale et compromettre le flux sanguin vers le bébé."
        },
        {
            "text": "Lui demander de pousser vers le bas en retenant sa respiration dès qu'elle ressent la contraction.",
            "isCorrect": true,
            "comment": "Correct. Pousser vers le bas pendant les contractions en retenant sa respiration peut aider à expulser le bébé de manière contrôlée."
        },
        {
            "text": "Lui demander de respirer rapidement.",
            "isCorrect": false,
            "comment": "Incorrect. Respirer rapidement n'est pas une méthode efficace pour pousser pendant l'accouchement, car cela ne crée pas suffisamment de pression pour expulser le bébé."
        },
        {
            "text": "Lui demander de se calmer et de ne pas pousser.",
            "isCorrect": false,
            "comment": "Incorrect. Demander à la future maman de ne pas pousser peut retarder l'accouchement et causer des complications."
        }
    ]
},


{
    "text": "Quelle précaution doit-on prendre lors de l'expulsion de la tête du bébé ?",
    "answers": [
        {
            "text": "Tirer sur la tête du bébé pour l'aider à sortir plus rapidement.",
            "isCorrect": false,
            "comment": "Incorrect. Il ne faut jamais tirer sur la tête du bébé lors de l'accouchement, car cela peut causer des blessures graves à la mère et au bébé."
        },
        {
            "text": "Utiliser un instrument pour élargir le passage.",
            "isCorrect": false,
            "comment": "Incorrect. L'utilisation d'instruments pour élargir le passage n'est pas recommandée, sauf dans des cas très spécifiques et sous la supervision d'un professionnel de santé qualifié."
        },
        {
            "text": "Laisser sortir la tête naturellement en la soutenant pour éviter les déchirures du périnée.",
            "isCorrect": true,
            "comment": "Correct. Il est essentiel de permettre à la tête du bébé de sortir naturellement, en la soutenant délicatement pour éviter les déchirures du périnée."
        },
        {
            "text": "Arrêter les contractions pour éviter les risques.",
            "isCorrect": false,
            "comment": "Incorrect. Arrêter les contractions pendant l'expulsion peut compliquer l'accouchement et augmenter les risques pour la mère et le bébé."
        }
    ]
},

{
    "text": "Que doit-on faire une fois que la tête du bébé est totalement sortie ?",
    "answers": [
        {
            "text": "Attendre que le bébé sorte complètement tout seul.",
            "isCorrect": false,
            "comment": "Incorrect. Une fois que la tête du bébé est sortie, il est important de continuer le processus d'accouchement en soutenant doucement le reste du corps du bébé."
        },
        {
            "text": "Faire sortir rapidement le bébé.",
            "isCorrect": false,
            "comment": "Incorrect. Bien que le processus d'accouchement doive se dérouler sans précipitation, il est important de continuer à assister le bébé à sortir délicatement."
        },
        {
            "text": "Vérifier l’absence d'un cordon ombilical autour du cou du bébé.",
            "isCorrect": true,
            "comment": "Correct. Il est crucial de vérifier immédiatement s'il y a un enroulement du cordon ombilical autour du cou du bébé et de le retirer avec précaution si nécessaire pour éviter les complications."
        },
        {
            "text": "Continuer à pousser la mère pour accélérer l'expulsion.",
            "isCorrect": false,
            "comment": "Incorrect. Une fois que la tête du bébé est sortie, il n'est plus nécessaire de demander à la mère de pousser. L'expulsion du reste du corps du bébé doit être assistée avec précaution."
        }
    ]
},

{
    "text": "Quels équipements sont nécessaires pour une éventuelle réanimation du nouveau-né ?",
    "answers": [
        {
            "text": "Un téléphone portable.",
            "isCorrect": false,
            "comment": "Incorrect. Un téléphone portable peut être utile pour appeler les secours, mais il n'est pas un équipement médical pour la réanimation d'un nouveau-né."
        },
        {
            "text": "Une bouteille d'oxygène, un insufflateur manuel pédiatrique, un aspirateur de mucosités et un oxymètre de pouls.",
            "isCorrect": true,
            "comment": "Correct. Ces équipements sont nécessaires pour fournir une assistance respiratoire et surveiller les signes vitaux du nouveau-né lors de la réanimation."
        },
        {
            "text": "Un thermomètre.",
            "isCorrect": false,
            "comment": "Incorrect. Un thermomètre peut être utile pour surveiller la température du nouveau-né, mais il n'est pas essentiel pour la réanimation."
        },
        {
            "text": "Des compresses stériles.",
            "isCorrect": false,
            "comment": "Incorrect. Les compresses stériles peuvent être utilisées pour d'autres aspects des soins du nouveau-né, mais elles ne sont pas spécifiques à la réanimation."
        }
    ]
},

{
    "text": "Quel est le matériel nécessaire pour l'accouchement sur place ?",
    "answers": [
        {
            "text": "Un materkit.",
            "isCorrect": true,
            "comment": "Correct. Un materkit contenant des fournitures médicales nécessaires à l'accouchement sur place est essentiel pour assurer la sécurité de la mère et du bébé."
        },
        {
            "text": "Des pansements.",
            "isCorrect": false,
            "comment": "Incorrect. Les pansements peuvent être utiles pour d'autres situations médicales, mais ils ne sont pas spécifiquement nécessaires pour l'accouchement sur place."
        },
        {
            "text": "Des serviettes de bain propres et sèches.",
            "isCorrect": true,
            "comment": "Correct. Des serviettes de bain propres et sèches peuvent être utilisées pour aider à maintenir la propreté pendant l'accouchement sur place."
        },
        {
            "text": "Des bandages.",
            "isCorrect": false,
            "comment": "Incorrect. Les bandages peuvent être nécessaires pour d'autres blessures, mais ils ne sont pas spécifiquement nécessaires pour l'accouchement sur place."
        }
    ]
},


{
    "text": "Comment doit-on aider la mère pendant l'accouchement ?",
    "answers": [
        {
            "text": "En la laissant seule.",
            "isCorrect": false,
            "comment": "Incorrect. Pendant l'accouchement, il est crucial de soutenir et d'assister la mère à chaque étape du processus."
        },
        {
            "text": "En lui demandant de pousser vers le bas lors des contractions.",
            "isCorrect": true,
            "comment": "Correct. Encourager la mère à pousser vers le bas lors des contractions peut aider à faciliter l'expulsion du bébé."
        },
        {
            "text": "En lui donnant à boire.",
            "isCorrect": false,
            "comment": "Incorrect. Pendant l'accouchement, la mère peut être limitée dans sa capacité à boire, en particulier si elle est proche de la naissance du bébé."
        },
        {
            "text": "En la plaçant sur le ventre.",
            "isCorrect": false,
            "comment": "Incorrect. Placer la mère sur le ventre n'est généralement pas recommandé pendant l'accouchement, car cela peut être inconfortable et peu pratique."
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
