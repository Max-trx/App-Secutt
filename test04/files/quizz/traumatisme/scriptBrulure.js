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
      feedbackText = "";
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
    "text": "Quelles sont les caractéristiques d'une brûlure simple ?",
    "answers": [
        {
            text: "a) Présence de plusieurs cloques de petite taille",
            "isCorrect": false,
            "comment": "Ce n'est pas une caractéristique d'une brûlure simple."
        },
        {
            text: "b) Destruction profonde de la peau avec aspect noirâtre",
            "isCorrect": false,
            "comment": "Ce n'est pas une caractéristique d'une brûlure simple."
        },
        {
            text: "c) Rougeurs de la peau chez l'adulte ou une cloque dont la surface est inférieure à celle de la moitié de la paume de la main de la victime",
            "isCorrect": true,
            "comment": "Les brûlures simples se caractérisent par des rougeurs de la peau ou des cloques de petite taille."
        },
        {
            text: "d) Brûlure circulaire autour du cou ou d'un membre",
            "isCorrect": false,
            "comment": "Ce n'est pas une caractéristique d'une brûlure simple."
        }
    ]
},
{
    "text": "Quels sont les principaux risques associés à une brûlure ?",
    "answers": [
        {
            text: "a) Perte de cheveux et éruptions cutanées",
            "isCorrect": false,
            "comment": "Ces risques ne sont généralement pas associés aux brûlures."
        },
        {
            text: "b) Défaillance respiratoire et défaillance circulatoire",
            "isCorrect": true,
            "comment": "Les brûlures peuvent entraîner une défaillance respiratoire et circulatoire."
        },
        {
            text: "c) Augmentation de la température corporelle et troubles digestifs",
            "isCorrect": false,
            "comment": "Ces risques ne sont généralement pas associés aux brûlures."
        },
        {
            text: "d) Fractures osseuses et saignements abondants",
            "isCorrect": false,
            "comment": "Ces risques ne sont généralement pas associés aux brûlures."
        }
    ]
},
{
    "text": "Quels sont les signes caractéristiques d'une brûlure grave ?",
    "answers": [
        {
            text: "a) Présence de douleur et peau rouge sèche",
            "isCorrect": false,
            "comment": "Ces signes ne caractérisent pas une brûlure grave."
        },
        {
            text: "b) Cloques multiples et étendues, destruction profonde de la peau",
            "isCorrect": true,
            "comment": "Les brûlures graves se caractérisent par des cloques étendues et une destruction profonde de la peau."
        },
        {
            text: "c) Apparition de fougères sur la peau",
            "isCorrect": false,
            "comment": "Ce n'est pas un signe caractéristique d'une brûlure grave."
        },
        {
            text: "d) Brûlure localisée sur le dos de la main",
            "isCorrect": false,
            "comment": "Ce n'est pas un signe caractéristique d'une brûlure grave."
        }
    ]
},
{
    "text": "Quel est le principe de l'action de secours pour une brûlure thermique ?",
    "answers": [
        {
            text: "a) Appliquer de la glace directement sur la brûlure",
            "isCorrect": false,
            "comment": "L'application de glace directe n'est pas recommandée pour une brûlure thermique."
        },
        {
            text: "b) Ne pas retirer les vêtements de la victime",
            "isCorrect": false,
            "comment": "Il est généralement recommandé de retirer les vêtements pour traiter une brûlure thermique."
        },
        {
            text: "c) Arroser la brûlure avec de l'eau tempérée dans les 30 minutes suivant la survenue",
            "isCorrect": true,
            "comment": "Le principe est d'arroser la brûlure avec de l'eau tempérée dans les 30 minutes suivant la survenue."
        },
        {
            text: "d) Percer les cloques pour soulager la douleur",
            "isCorrect": false,
            "comment": "Percer les cloques peut augmenter le risque d'infection."
        }
    ]
},
{
    "text": "Comment doit être traitée une brûlure chimique ?",
    "answers": [
        {
            text: "a) Enlever les vêtements et laver la zone atteinte avec de l'eau tempérée pendant au moins 20 minutes",
            "isCorrect": true,
            "comment": "Il faut enlever les vêtements et laver la zone atteinte avec de l'eau tempérée pendant au moins 20 minutes."
        },
        {
            text: "b) Ne pas toucher la victime et attendre l'arrivée des secours",
            "isCorrect": false,
            "comment": "Il est important de prendre des mesures immédiates pour traiter une brûlure chimique."
        },
        {
            text: "c) Appliquer une pommade anti-inflammatoire sur la brûlure",
            "isCorrect": false,
            "comment": "Les pommades peuvent aggraver les brûlures chimiques."
        },
        {
            text: "d) Couvrir la brûlure avec un bandage serré",
            "isCorrect": false,
            "comment": "Il ne faut pas couvrir la brûlure avec un bandage serré, cela peut aggraver les dommages."
        }
    ]
},
{
    "text": "Quelles sont les caractéristiques d'une brûlure grave ?",
    "answers": [
        {
            text: "a) Présence de rougeurs de la peau chez l'adulte",
            "isCorrect": false,
            "comment": "Les brûlures graves ne se manifestent pas par de simples rougeurs de la peau."
        },
        {
            text: "b) Destruction de la peau avec aspect noirâtre",
            "isCorrect": true,
            "comment": "Les brûlures graves peuvent entraîner une destruction profonde de la peau avec un aspect noirâtre."
        },
        {
            text: "c) Cloques dont la surface totale est supérieure à celle de la moitié de la paume de la main de la victime",
            "isCorrect": true,
            "comment": "Les brûlures graves peuvent se caractériser par des cloques étendues."
        },
        {
            text: "d) Brûlure circulaire autour de l'abdomen",
            "isCorrect": false,
            "comment": "Ce n'est pas une caractéristique typique d'une brûlure grave."
        }
    ]
},
{
    "text": "Quels sont les principaux risques associés à une brûlure ?",
    "answers": [
        {
            text: "a) Infection des ongles et saignements de nez",
            "isCorrect": false,
            "comment": "Ces risques ne sont généralement pas associés aux brûlures."
        },
        {
            text: "b) Défaillance circulatoire par perte de liquide",
            "isCorrect": true,
            "comment": "Les brûlures peuvent entraîner une défaillance circulatoire par perte de liquide."
        },
        {
            text: "c) Augmentation de la pression artérielle",
            "isCorrect": false,
            "comment": "Les brûlures ne conduisent généralement pas à une augmentation de la pression artérielle."
        },
        {
            text: "d) Perte d'appétit et fatigue",
            "isCorrect": false,
            "comment": "Ces symptômes ne sont généralement pas associés aux brûlures."
        }
    ]
},
{
    "text": "Comment reconnaître une brûlure grave ?",
    "answers": [
        {
            text: "a) Par la présence de démangeaisons intenses",
            "isCorrect": false,
            "comment": "Les démangeaisons ne sont généralement pas associées aux brûlures graves."
        },
        {
            text: "b) Par l'apparition de taches violettes sur la peau",
            "isCorrect": false,
            "comment": "Ce n'est pas un signe caractéristique d'une brûlure grave."
        },
        {
            text: "c) Par la couleur blanchâtre ou noire de la zone brûlée et la présence de cloques",
            "isCorrect": true,
            "comment": "Les brûlures graves se caractérisent par une couleur blanchâtre ou noire de la zone brûlée et la présence de cloques."
        },
        {
            text: "d) Par un léger rougissement de la peau",
            "isCorrect": false,
            "comment": "Les brûlures graves ne se manifestent généralement pas par un léger rougissement de la peau."
        }
    ]
},
{
    "text": "Que faire en cas de brûlure par inhalation ?",
    "answers": [
        {
            text: "a) Faire vomir la victime",
            "isCorrect": false,
            "comment": "Faire vomir la victime n'est pas recommandé en cas de brûlure par inhalation."
        },
        {
            text: "b) Plonger la victime dans de l'eau froide",
            "isCorrect": false,
            "comment": "Plonger la victime dans de l'eau froide n'est pas recommandé pour une brûlure par inhalation."
        },
        {
            text: "c) Lutter contre une éventuelle détresse respiratoire",
            "isCorrect": true,
            "comment": "Il est important de prendre des mesures pour lutter contre une détresse respiratoire en cas de brûlure par inhalation."
        },
        {
            text: "d) Donner à boire à la victime pour apaiser la gorge",
            "isCorrect": false,
            "comment": "Donner à boire peut aggraver la situation en cas de brûlure par inhalation."
        }
    ]
},
{
    "text": "Comment identifier une brûlure interne par ingestion ?",
    "answers": [
        {
            text: "a) Par l'apparition de cloques sur la peau",
            "isCorrect": false,
            "comment": "Les cloques ne se forment pas sur la peau en cas de brûlure interne par ingestion."
        },
        {
            text: "b) En observant une rougeur autour de la zone brûlée",
            "isCorrect": false,
            "comment": "Les rougeurs autour de la zone brûlée ne sont pas typiques d'une brûlure interne par ingestion."
        },
        {
            text: "c) En écoutant les plaintes de la victime",
            "isCorrect": false,
            "comment": "Les symptômes internes ne sont pas toujours audibles."
        },
        {
            text: "d) Par la présence de violentes douleurs dans la poitrine ou à l'abdomen",
            "isCorrect": true,
            "comment": "Les brûlures internes par ingestion peuvent entraîner de violentes douleurs dans la poitrine ou à l'abdomen."
        }
    ]
},
{
    "text": "Quel est le principal risque associé à une brûlure chimique ?",
    "answers": [
        {
            text: "a) Défaillance respiratoire",
            "isCorrect": false,
            "comment": "La défaillance respiratoire n'est pas le principal risque associé à une brûlure chimique."
        },
        {
            text: "b) Infection de la peau",
            "isCorrect": true,
            "comment": "L'infection de la peau est l'un des principaux risques associés à une brûlure chimique."
        },
        {
            text: "c) Défaillance circulatoire",
            "isCorrect": false,
            "comment": "La défaillance circulatoire n'est pas le principal risque associé à une brûlure chimique."
        },
        {
            text: "d) Endommagement des organes internes",
            "isCorrect": false,
            "comment": "L'endommagement des organes internes n'est pas le principal risque associé à une brûlure chimique."
        }
    ]
},
{
    "text": "Que faut-il éviter de faire en cas de brûlure chimique dans l'œil ?",
    "answers": [
        {
            text: "a) Rincer abondamment avec de l'eau sans que l'eau de lavage ne coule sur l'autre œil",
            "isCorrect": true,
            "comment": "Il faut rincer abondamment avec de l'eau sans que l'eau de lavage ne coule sur l'autre œil."
        },
        {
            text: "b) Appliquer de la glace sur l'œil brûlé",
            "isCorrect": false,
            "comment": "L'application de glace peut aggraver la brûlure chimique dans l'œil."
        },
        {
            text: "c) Frotter vigoureusement l'œil brûlé",
            "isCorrect": false,
            "comment": "Frotter vigoureusement peut aggraver la brûlure chimique dans l'œil."
        },
        {
            text: "d) Ne rien faire et attendre l'arrivée des secours",
            "isCorrect": false,
            "comment": "Il est important de prendre des mesures immédiates pour traiter une brûlure chimique dans l'œil."
        }
    ]
},
{
    "text": "Quelle est la conduite à tenir pour une brûlure interne par ingestion ?",
    "answers": [
        {
            text: "a) Faire vomir la victime",
            "isCorrect": false,
            "comment": "Faire vomir la victime peut aggraver la situation en cas de brûlure interne par ingestion."
        },
        {
            text: "b) Lui donner à boire pour diluer le produit ingéré",
            "isCorrect": false,
            "comment": "Donner à boire peut aggraver la situation en cas de brûlure interne par ingestion."
        },
        {
            text: "c) Lutter contre une détresse respiratoire associée",
            "isCorrect": false,
            "comment": "La détresse respiratoire n'est pas toujours associée à une brûlure interne par ingestion."
        },
        {
            text: "d) Allonger la victime sur le côté et ne jamais lui faire vomir",
            "isCorrect": true,
            "comment": "Il faut allonger la victime sur le côté et ne jamais lui faire vomir en cas de brûlure interne par ingestion."
        }
    ]
},
{
  "text": "Quelle est la définition d'une plaie ?",
  "answers": [
      {
          text: "a) Une décoloration de la peau",
          "isCorrect": false,
          "comment": "Une plaie n'est pas simplement une décoloration de la peau."
      },
      {
          text: "b) Une lésion de la peau avec effraction et atteinte possible des tissus sous-jacents",
          "isCorrect": true,
          "comment": "Une plaie est une lésion de la peau avec effraction et atteinte possible des tissus sous-jacents."
      },
      {
          text: "c) Une éruption cutanée",
          "isCorrect": false,
          "comment": "Une éruption cutanée n'est pas une définition de plaie."
      },
      {
          text: "d) Une sensation de démangeaison sur la peau",
          "isCorrect": false,
          "comment": "Une sensation de démangeaison n'est pas une définition de plaie."
      }
  ]
},
{
  "text": "Quelles sont les principales causes des plaies ?",
  "answers": [
      {
          text: "a) Les brûlures chimiques",
          "isCorrect": false,
          "comment": "Les brûlures chimiques peuvent causer des lésions cutanées, mais ne sont pas les principales causes des plaies."
      },
      {
          text: "b) Les éruptions cutanées",
          "isCorrect": false,
          "comment": "Les éruptions cutanées sont des affections de la peau, mais ne sont pas des causes principales des plaies."
      },
      {
          text: "c) Les chutes",
          "isCorrect": true,
          "comment": "Les chutes sont l'une des principales causes des plaies."
      },
      {
          text: "d) Les piqûres d'insectes",
          "isCorrect": false,
          "comment": "Les piqûres d'insectes peuvent causer des lésions cutanées, mais ne sont pas les principales causes des plaies."
      }
  ]
},
{
  "text": "Quelles sont les conséquences possibles d'une plaie ?",
  "answers": [
      {
          text: "a) Une augmentation de la pression artérielle",
          "isCorrect": false,
          "comment": "Une augmentation de la pression artérielle n'est pas une conséquence typique d'une plaie."
      },
      {
          text: "b) Une défaillance respiratoire",
          "isCorrect": true,
          "comment": "Une défaillance respiratoire peut être une conséquence possible d'une plaie, notamment en cas de lésion importante."
      },
      {
          text: "c) Une réduction de la douleur",
          "isCorrect": false,
          "comment": "Une réduction de la douleur n'est pas une conséquence typique d'une plaie, sauf en cas de traitement médicamenteux."
      },
      {
          text: "d) Une amélioration de l'état général",
          "isCorrect": false,
          "comment": "Une amélioration de l'état général n'est pas une conséquence typique d'une plaie, sauf en cas de traitement adéquat."
      }
  ]
},
{
  "text": "Comment reconnaître la gravité d'une plaie ?",
  "answers": [
      {
          text: "a) Au cours du 1er regard",
          "isCorrect": false,
          "comment": "Reconnaître la gravité d'une plaie nécessite souvent une évaluation plus détaillée que simplement un premier regard."
      },
      {
          text: "b) Au cours du 2ème regard",
          "isCorrect": false,
          "comment": "Reconnaître la gravité d'une plaie nécessite souvent une évaluation plus détaillée que simplement un deuxième regard."
      },
      {
          text: "c) Au cours du 3ème regard",
          "isCorrect": false,
          "comment": "Reconnaître la gravité d'une plaie nécessite souvent une évaluation plus détaillée que simplement un troisième regard."
      },
      {
          text: "d) Au cours du 4ème regard",
          "isCorrect": true,
          "comment": "Reconnaître la gravité d'une plaie nécessite souvent une évaluation approfondie, et cela peut prendre plusieurs regards pour le faire de manière adéquate."
      }
  ]
},
{
  "text": "Qu'est-ce qu'une contusion ?",
  "answers": [
      {
          text: "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": false,
          "comment": "Une contusion n'est pas provoquée par un objet tranchant, mais plutôt par un choc ou un coup."
      },
      {
          text: "b) Un choc ou un coup pouvant provoquer une rupture des vaisseaux situés sous la peau",
          "isCorrect": true,
          "comment": "Une contusion est un choc ou un coup qui peut provoquer une rupture des vaisseaux sanguins sous la peau, entraînant un hématome."
      },
      {
          text: "c) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": false,
          "comment": "Cette description correspond davantage à une écorchure plutôt qu'à une contusion."
      },
      {
          text: "d) Une déchirure de la peau par arrachement ou écrasement",
          "isCorrect": false,
          "comment": "Cette description correspond à une plaie ou une lacération, mais pas à une contusion."
      }
  ]
},
{
  "text": "Qu'est-ce qu'une écorchure ?",
  "answers": [
      {
          text: "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": false,
          "comment": "Une écorchure n'est pas provoquée par un objet tranchant, mais plutôt par un frottement ou un glissement de la peau contre une surface rugueuse."
      },
      {
          text: "b) Un choc ou un coup pouvant provoquer une rupture des vaisseaux situés sous la peau",
          "isCorrect": false,
          "comment": "Cette description correspond davantage à une contusion plutôt qu'à une écorchure."
      },
      {
          text: "c) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": true,
          "comment": "Une écorchure est une plaie superficielle de la peau qui résulte généralement d'un frottement ou d'un abrasion, et elle présente souvent un aspect rouge et suintant."
      },
      {
          text: "d) Une déchirure de la peau par arrachement ou écrasement",
          "isCorrect": false,
          "comment": "Cette description correspond à une lacération plutôt qu'à une écorchure."
      }
  ]
},
{
  "text": "Qu'est-ce qu'une contusion ?",
  "answers": [
      {
          text: "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": false,
          "comment": "Une contusion n'est pas provoquée par un objet tranchant, mais plutôt par un choc ou un coup."
      },
      {
          text: "b) Un choc ou un coup pouvant provoquer une rupture des vaisseaux situés sous la peau",
          "isCorrect": true,
          "comment": "Une contusion est un choc ou un coup qui peut provoquer une rupture des vaisseaux sanguins sous la peau, entraînant un hématome."
      },
      {
          text: "c) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": false,
          "comment": "Cette description correspond davantage à une écorchure plutôt qu'à une contusion."
      },
      {
          text: "d) Une déchirure de la peau par arrachement ou écrasement",
          "isCorrect": false,
          "comment": "Cette description correspond à une plaie ou une lacération, mais pas à une contusion."
      }
  ]
},
{
  "text": "Qu'est-ce qu'une écorchure ?",
  "answers": [
      {
          text: "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": false,
          "comment": "Une écorchure n'est pas provoquée par un objet tranchant, mais plutôt par un frottement ou un glissement de la peau contre une surface rugueuse."
      },
      {
          text: "b) Un choc ou un coup pouvant provoquer une rupture des vaisseaux situés sous la peau",
          "isCorrect": false,
          "comment": "Cette description correspond davantage à une contusion plutôt qu'à une écorchure."
      },
      {
          text: "c) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": true,
          "comment": "Une écorchure est une plaie superficielle de la peau qui résulte généralement d'un frottement ou d'un abrasion, et elle présente souvent un aspect rouge et suintant."
      },
      {
          text: "d) Une déchirure de la peau par arrachement ou écrasement",
          "isCorrect": false,
          "comment": "Cette description correspond à une lacération plutôt qu'à une écorchure."
      }
  ]
},

{
  "text": "Qu'est-ce qu'une coupure ?",
  "answers": [
      {
          text: "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": true,
          "comment": "Une coupure est une lésion de la peau causée par un objet tranchant, comme un couteau ou une lame."
      },
      {
          text: "b) Un choc ou un coup pouvant provoquer une rupture des vaisseaux situés sous la peau",
          "isCorrect": false,
          "comment": "Cette description correspond plutôt à une contusion."
      },
      {
          text: "c) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": false,
          "comment": "Cette description correspond davantage à une écorchure."
      },
      {
          text: "d) Une déchirure de la peau par arrachement ou écrasement",
          "isCorrect": false,
          "comment": "Cette description correspond à une lacération."
      }
  ]
},
{
  "text": "Qu'est-ce qu'une plaie punctiforme ?",
  "answers": [
      {
          text: "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": false,
          "comment": "Une plaie punctiforme n'est pas provoquée par un objet tranchant."
      },
      {
          text: "b) Une plaie souvent profonde, provoquée par un objet pointu",
          "isCorrect": true,
          "comment": "Une plaie punctiforme est généralement causée par un objet pointu, comme une aiguille ou une épingle, et elle est souvent petite et profonde."
      },
      {
          text: "c) Une déchirure de la peau par arrachement ou écrasement",
          "isCorrect": false,
          "comment": "Cette description correspond plutôt à une lacération."
      },
      {
          text: "d) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": false,
          "comment": "Cette description correspond davantage à une écorchure."
      }
  ]
},

{
  "text": "Quelle est la conduite à tenir en présence d'une plaie grave ?",
  "answers": [
      {
          text: "a) Retirer immédiatement le corps étranger pénétrant",
          "isCorrect": false,
          "comment": "Retirer immédiatement un corps étranger pénétrant peut aggraver la blessure."
      },
      {
          text: "b) Protéger la plaie par un pansement stérile humidifié",
          "isCorrect": true,
          "comment": "La protection de la plaie par un pansement stérile humidifié peut aider à prévenir l'infection et à favoriser la guérison."
      },
      {
          text: "c) Ne jamais appliquer de pansement sur la plaie",
          "isCorrect": false,
          "comment": "Il est important de protéger la plaie pour éviter les infections."
      },
      {
          text: "d) Masser doucement la zone autour de la plaie",
          "isCorrect": false,
          "comment": "Masser la zone autour de la plaie peut aggraver la blessure et augmenter le risque d'infection."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en présence d'une plaie simple ?",
  "answers": [
      {
          text: "a) Retirer les vêtements autour de la plaie",
          "isCorrect": false,
          "comment": "Il n'est pas toujours nécessaire de retirer les vêtements autour de la plaie."
      },
      {
          text: "b) Nettoyer la plaie avec de l'eau courante ou du sérum physiologique",
          "isCorrect": true,
          "comment": "Nettoyer la plaie avec de l'eau courante ou du sérum physiologique peut aider à réduire le risque d'infection."
      },
      {
          text: "c) Appliquer un pansement adhésif directement sur la plaie",
          "isCorrect": false,
          "comment": "Il est préférable d'utiliser un pansement stérile plutôt qu'un pansement adhésif directement sur la plaie."
      },
      {
          text: "d) Masser vigoureusement la zone autour de la plaie",
          "isCorrect": false,
          "comment": "Masser vigoureusement la zone autour de la plaie peut aggraver la blessure et augmenter le risque d'infection."
      }
  ]
},

{
  "text": "Que faut-il faire en cas de plaie par injection de liquide sous pression ?",
  "answers": [
      {
          text: "a) Demander à la victime de retirer le corps étranger pénétrant",
          "isCorrect": false,
          "comment": "Il ne faut jamais retirer le corps étranger pénétrant dans le cas d'une plaie par injection de liquide sous pression, cela pourrait aggraver la blessure."
      },
      {
          text: "b) Ne rien faire et attendre l'arrivée des secours",
          "isCorrect": false,
          "comment": "Il est important de prendre des mesures immédiates en cas de plaie par injection de liquide sous pression pour réduire les risques."
      },
      {
          text: "c) Recueillir la nature du produit injecté et la valeur de la pression d'injection",
          "isCorrect": true,
          "comment": "Il est crucial de recueillir des informations sur la nature du produit injecté et la pression d'injection pour guider les soins médicaux appropriés."
      },
      {
          text: "d) Appliquer une compresse froide sur la plaie",
          "isCorrect": false,
          "comment": "Appliquer une compresse froide peut ne pas être approprié dans ce cas. La priorité est de recueillir des informations sur la blessure."
      }
  ]
},
{
  "text": "Comment protéger une plaie par un pansement stérile ?",
  "answers": [
      {
          text: "a) En utilisant un film plastique adhésif",
          "isCorrect": false,
          "comment": "Un film plastique adhésif peut ne pas être approprié pour protéger une plaie stérile, car il peut ne pas maintenir l'asepsie."
      },
      {
          text: "b) En appliquant plusieurs couches de gaze",
          "isCorrect": false,
          "comment": "L'application de plusieurs couches de gaze peut ne pas fournir une protection adéquate contre les contaminants externes."
      },
      {
          text: "c) En humidifiant le pansement avec de l'alcool",
          "isCorrect": false,
          "comment": "L'utilisation d'alcool peut être irritante pour la plaie et ne contribue pas à la protection stérile."
      },
      {
          text: "d) En utilisant un pansement stérile qui maintient l'humidité",
          "isCorrect": true,
          "comment": "Un pansement stérile qui maintient l'humidité est recommandé pour protéger une plaie stérile, car il favorise la guérison et réduit le risque d'infection."
      }
  ]
},
{
  "text": "Quel est le principal risque associé à une plaie ?",
  "answers": [
      {
          text: "a) Une amélioration de l'état de santé général",
          "isCorrect": false,
          "comment": "Une plaie peut entraîner divers risques pour la santé, mais l'amélioration de l'état général n'en fait généralement pas partie."
      },
      {
          text: "b) Une infection de la plaie",
          "isCorrect": true,
          "comment": "L'une des principales complications associées à une plaie est l'infection, qui peut entraîner des complications graves si elle n'est pas traitée correctement."
      },
      {
          text: "c) Une diminution de la pression artérielle",
          "isCorrect": false,
          "comment": "Bien qu'une plaie puisse entraîner une perte de sang et une diminution de la pression artérielle, ce n'est pas le principal risque associé à une plaie."
      },
      {
          text: "d) Une augmentation de la fréquence cardiaque",
          "isCorrect": false,
          "comment": "Une augmentation de la fréquence cardiaque peut être une réponse physiologique à une plaie, mais ce n'est pas le principal risque associé."
      }
  ]
},
{
  "text": "Quelle est la première étape de la conduite à tenir en présence d'une plaie ?",
  "answers": [
      {
          text: "a) Appliquer immédiatement un pansement",
          "isCorrect": false,
          "comment": "L'application immédiate d'un pansement peut ne pas être recommandée sans évaluation de la gravité de la plaie."
      },
      {
          text: "b) Nettoyer la plaie avec de l'alcool",
          "isCorrect": false,
          "comment": "L'utilisation d'alcool pour nettoyer la plaie peut être irritante et n'est pas recommandée."
      },
      {
          text: "c) Se laver les mains",
          "isCorrect": true,
          "comment": "La première étape de la conduite à tenir en présence d'une plaie est de se laver les mains pour éviter toute contamination."
      },
      {
          text: "d) Examiner la plaie pour déterminer sa gravité",
          "isCorrect": false,
          "comment": "L'examen de la plaie pour déterminer sa gravité est important mais ne doit pas nécessairement être la première étape."
      }
  ]
},
{
  "text": "Comment faut-il procéder en cas de plaie avec saignement abondant ?",
  "answers": [
      {
          text: "a) Appliquer immédiatement une compresse sèche",
          "isCorrect": false,
          "comment": "Il est important de ne pas utiliser de compresse sèche, car cela peut aggraver le saignement en perturbant la formation du caillot."
      },
      {
          text: "b) Comprimer la plaie avec une compresse stérile ou un tissu propre",
          "isCorrect": true,
          "comment": "En cas de saignement abondant, il est essentiel de comprimer fermement la plaie avec une compresse stérile ou un tissu propre pour arrêter le saignement."
      },
      {
          text: "c) Laisser le sang s'écouler naturellement",
          "isCorrect": false,
          "comment": "Laisser le sang s'écouler naturellement peut entraîner une perte de sang excessive et des complications graves."
      },
      {
          text: "d) Masser doucement la plaie pour stimuler la circulation sanguine",
          "isCorrect": false,
          "comment": "Masser la plaie peut aggraver le saignement en dispersant le sang et en perturbant la formation du caillot."
      }
  ]
},
{
  "text": "Quelle est la première étape de la conduite à tenir en cas de plaie avec corps étranger ?",
  "answers": [
      {
          text: "a) Retirer immédiatement le corps étranger",
          "isCorrect": false,
          "comment": "La première étape n'est pas nécessairement de retirer immédiatement le corps étranger, car cela peut aggraver la blessure."
      },
      {
          text: "b) Nettoyer la plaie avec de l'eau courante",
          "isCorrect": false,
          "comment": "Avant de nettoyer la plaie, il est important d'examiner la plaie pour déterminer sa gravité."
      },
      {
          text: "c) Protéger la plaie avec un pansement stérile",
          "isCorrect": false,
          "comment": "Protéger la plaie est important, mais ce n'est pas la première étape à prendre en compte lorsqu'il y a un corps étranger dans la plaie."
      },
      {
          text: "d) Examiner la plaie pour déterminer sa gravité",
          "isCorrect": true,
          "comment": "La première étape consiste à examiner la plaie pour évaluer la présence et la gravité du corps étranger et de la blessure."
      }
  ]
},

{
  "text": "Quelle est la durée minimale recommandée pour laver une plaie à grande eau ?",
  "answers": [
      {
          text: "a) 5 minutes",
          "isCorrect": false,
          "comment": "La durée minimale recommandée pour laver une plaie à grande eau est généralement supérieure à 5 minutes."
      },
      {
          text: "b) 10 minutes",
          "isCorrect": true,
          "comment": "Il est recommandé de laver une plaie à grande eau pendant au moins 10 minutes pour assurer un nettoyage efficace."
      },
      {
          text: "c) 15 minutes",
          "isCorrect": false,
          "comment": "Bien que laver une plaie à grande eau soit important, une durée de 15 minutes peut être excessive et peu pratique dans de nombreux cas."
      },
      {
          text: "d) 20 minutes",
          "isCorrect": false,
          "comment": "Une durée de 20 minutes pour le lavage d'une plaie à grande eau peut être excessive et n'est généralement pas nécessaire."
      }
  ]
},
{
  "text": "Quelle est la meilleure méthode pour protéger une plaie après l'avoir nettoyée ?",
  "answers": [
      {
          text: "a) En l'exposant à l'air libre",
          "isCorrect": false,
          "comment": "Exposer une plaie à l'air libre peut augmenter le risque d'infection et ralentir le processus de guérison."
      },
      {
          text: "b) En appliquant une crème hydratante",
          "isCorrect": false,
          "comment": "Les crèmes hydratantes ne sont généralement pas utilisées pour protéger une plaie, car elles peuvent favoriser la croissance bactérienne."
      },
      {
          text: "c) En couvrant la plaie avec un pansement stérile",
          "isCorrect": true,
          "comment": "La meilleure méthode pour protéger une plaie après l'avoir nettoyée est de la couvrir avec un pansement stérile pour prévenir les infections."
      },
      {
          text: "d) En la frottant vigoureusement avec une serviette",
          "isCorrect": false,
          "comment": "Frotter vigoureusement une plaie avec une serviette peut aggraver la blessure et augmenter le risque d'infection."
      }
  ]
},
{
  "text": "Quelle est la principale conséquence d'une infection de la plaie ?",
  "answers": [
      {
          text: "a) Une déshydratation",
          "isCorrect": false,
          "comment": "La déshydratation n'est généralement pas une conséquence directe d'une infection de la plaie."
      },
      {
          text: "b) Une défaillance circulatoire",
          "isCorrect": false,
          "comment": "Bien que les infections graves puissent affecter la circulation, une défaillance circulatoire n'est pas la principale conséquence d'une infection de la plaie."
      },
      {
          text: "c) Une douleur sévère",
          "isCorrect": false,
          "comment": "La douleur peut être associée à une infection de la plaie, mais ce n'est généralement pas la principale conséquence."
      },
      {
          text: "d) Une atteinte des organes sous-jacents",
          "isCorrect": true,
          "comment": "La principale conséquence d'une infection de la plaie est souvent une atteinte des organes sous-jacents, pouvant entraîner des complications graves."
      }
  ]
},

{
  "text": "Que doit-on éviter de faire en cas de plaie par injection de liquide sous pression ?",
  "answers": [
      {
          text: "a) Recueillir la nature du produit injecté",
          "isCorrect": false,
          "comment": "Recueillir la nature du produit injecté est important pour fournir les informations nécessaires aux professionnels de santé."
      },
      {
          text: "b) Ne jamais retirer le corps étranger pénétrant",
          "isCorrect": true,
          "comment": "En cas de plaie par injection de liquide sous pression, il est important de ne jamais retirer le corps étranger pénétrant, car cela pourrait aggraver les dommages internes."
      },
      {
          text: "c) Appliquer une compresse chaude sur la plaie",
          "isCorrect": false,
          "comment": "Appliquer une compresse chaude peut aggraver les blessures et augmenter le risque d'infection."
      },
      {
          text: "d) Demander un avis médical en transmettant le bilan",
          "isCorrect": false,
          "comment": "Demander un avis médical est important, mais il est également crucial de ne pas retirer le corps étranger pénétrant en cas de plaie par injection de liquide sous pression."
      }
  ]
},
{
  "text": "Quels sont les risques associés à une plaie par morsure ?",
  "answers": [
      {
          "text": "a) Risque de contamination par le VIH",
          "isCorrect": true,
          "comment": "Les plaies par morsure présentent un risque de contamination par le VIH, en raison de la possible présence de sang dans la bouche de l'agresseur."
      },
      {
          "text": "b) Risque de tétanos uniquement",
          "isCorrect": false,
          "comment": "En plus du risque de tétanos, les plaies par morsure présentent également un risque de contamination par le VIH et d'autres infections."
      },
      {
          "text": "c) Risque de fracture",
          "isCorrect": false,
          "comment": "Les plaies par morsure ne présentent pas nécessairement un risque de fracture, sauf dans les cas de morsures très graves."
      },
      {
          "text": "d) Risque de brûlure chimique",
          "isCorrect": false,
          "comment": "Les plaies par morsure ne sont généralement pas associées à un risque de brûlure chimique, sauf dans des circonstances très spécifiques."
      }
  ]
},

{
  "text": "25. Quels sont les risques associés à une plaie grave ?",
  "answers": [
      {
          "text": "a) Risque de contamination par le tétanos",
          "isCorrect": true,
          "comment": "Les plaies graves présentent un risque de contamination par le tétanos en raison de la présence de bactéries anaérobies dans le sol ou les matières fécales."
      },
      {
          "text": "b) Risque de détresse circulatoire",
          "isCorrect": true,
          "comment": "Les plaies graves peuvent entraîner un choc hypovolémique, également appelé détresse circulatoire, en raison de la perte de sang importante."
      },
      {
          "text": "c) Risque de contamination par le VIH",
          "isCorrect": true,
          "comment": "Les plaies graves présentent un risque de contamination par le VIH si du sang contaminé est présent sur l'objet ayant causé la blessure ou si le contact est direct avec le sang de la victime."
      },
      {
          "text": "d) Risque de brûlure électrique",
          "isCorrect": false,
          "comment": "Les plaies graves ne sont généralement pas associées à un risque de brûlure électrique, sauf dans des circonstances très spécifiques où une électrocution est impliquée."
      }
  ]
},
{
  "text": "26. Quelle est la principale conséquence d'une plaie par morsure ?",
  "answers": [
      {
          "text": "a) Risque de défaillance respiratoire",
          "isCorrect": false,
          "comment": "La principale conséquence d'une plaie par morsure est généralement liée au risque d'infection et non à une défaillance respiratoire."
      },
      {
          "text": "b) Risque de contamination par le VIH",
          "isCorrect": true,
          "comment": "Une des principales conséquences d'une plaie par morsure est le risque de contamination par le VIH, surtout si du sang est présent dans la bouche de l'agresseur."
      },
      {
          "text": "c) Risque de brûlure chimique",
          "isCorrect": false,
          "comment": "Les plaies par morsure ne sont généralement pas associées à un risque de brûlure chimique, sauf si des substances chimiques sont impliquées dans la morsure."
      },
      {
          "text": "d) Risque de fracture",
          "isCorrect": false,
          "comment": "Les plaies par morsure ne sont généralement pas associées à un risque de fracture, sauf dans des cas très graves où des os peuvent être fracturés."
      }
  ]
},
{
  "text": "27. Que doit-on éviter de faire en cas de plaie par morsure ?",
  "answers": [
      {
          "text": "a) Ne jamais nettoyer la plaie",
          "isCorrect": true,
          "comment": "Il est important de ne jamais nettoyer une plaie par morsure car cela pourrait introduire davantage de bactéries dans la blessure."
      },
      {
          "text": "b) Ne jamais consulter un médecin",
          "isCorrect": false,
          "comment": "Il est toujours recommandé de consulter un médecin en cas de plaie par morsure pour évaluer les risques d'infection et administrer un traitement approprié."
      },
      {
          "text": "c) Ne jamais recueillir la nature du produit injecté",
          "isCorrect": false,
          "comment": "Il est important de recueillir autant d'informations que possible sur la blessure pour permettre aux professionnels de santé de prendre les meilleures décisions en matière de traitement."
      },
      {
          "text": "d) Ne jamais retirer le corps étranger pénétrant",
          "isCorrect": false,
          "comment": "Retirer le corps étranger pénétrant peut être nécessaire dans certains cas, mais il est également important de rechercher des soins médicaux professionnels immédiatement."
      }
  ]
},

{
  "text": "28. Qu'est-ce qu'une plaie punctiforme ?",
  "answers": [
      {
          "text": "a) Une lésion provoquée par un objet tranchant",
          "isCorrect": false,
          "comment": "Une plaie punctiforme n'est pas causée par un objet tranchant mais plutôt par un objet pointu, comme une aiguille ou une épine."
      },
      {
          "text": "b) Une plaie souvent superficielle et peu profonde",
          "isCorrect": false,
          "comment": "Une plaie punctiforme peut en fait être profonde et traverser les organes sous-jacents, selon la force de la perforation."
      },
      {
          "text": "c) Une plaie souvent profonde, provoquée par un objet pointu",
          "isCorrect": true,
          "comment": "Une plaie punctiforme est généralement profonde et causée par un objet pointu, pouvant pénétrer dans les tissus sous-cutanés."
      },
      {
          "text": "d) Une plaie simple et superficielle avec un aspect rouge et suintant",
          "isCorrect": false,
          "comment": "Une plaie punctiforme n'est pas nécessairement simple et superficielle ; elle peut être profonde et ne pas nécessairement suinter de sang."
      }
  ]
},
{
  "text": "29. Comment protéger une plaie par un pansement en cas de plaie grave ?",
  "answers": [
      {
          "text": "a) Utiliser un pansement adhésif",
          "isCorrect": false,
          "comment": "Un pansement adhésif n'est généralement pas recommandé pour une plaie grave car il peut coller à la plaie et aggraver les dommages."
      },
      {
          "text": "b) Utiliser un pansement stérile ou un film plastique non adhésif",
          "isCorrect": true,
          "comment": "Pour une plaie grave, il est recommandé d'utiliser un pansement stérile ou un film plastique non adhésif pour protéger la plaie sans coller à elle."
      },
      {
          "text": "c) Laisser la plaie à l'air libre",
          "isCorrect": false,
          "comment": "Laisser une plaie grave à l'air libre peut augmenter le risque d'infection et prolonger le processus de guérison."
      },
      {
          "text": "d) Appliquer du savon sur la plaie avant de la protéger",
          "isCorrect": false,
          "comment": "Il est important de ne pas appliquer de savon directement sur une plaie, car cela peut provoquer une irritation et augmenter le risque d'infection."
      }
  ]
},
{
  "text": "3. Comment peut se manifester une éviscération ?",
  "answers": [
      {
          "text": "a) Par des douleurs aux membres",
          "isCorrect": false,
          "comment": "Une éviscération implique l'exposition des viscères à l'extérieur de l'abdomen, pas de douleurs aux membres."
      },
      {
          "text": "b) Par des vomissements répétés",
          "isCorrect": false,
          "comment": "Les vomissements répétés ne sont pas une manifestation typique d'une éviscération."
      },
      {
          "text": "c) Par des vomissements de sang",
          "isCorrect": false,
          "comment": "Les vomissements de sang peuvent indiquer d'autres conditions, mais pas nécessairement une éviscération."
      },
      {
          "text": "d) Par une exposition des viscères à l'extérieur de l'abdomen",
          "isCorrect": true,
          "comment": "Une éviscération se produit lorsque les viscères sont exposés à l'extérieur de l'abdomen."
      }
  ]
},
{
  "text": "4. Quelle est la conduite à tenir en présence d'une éviscération ?",
  "answers": [
      {
          "text": "a) Remettre immédiatement les viscères en place",
          "isCorrect": false,
          "comment": "Remettre les viscères en place sans les précautions nécessaires peut aggraver les blessures."
      },
      {
          "text": "b) Utiliser des compresses pour comprimer les viscères",
          "isCorrect": false,
          "comment": "Comprimer les viscères peut entraîner des dommages supplémentaires. Il est préférable de les protéger avec un champ stérile."
      },
      {
          "text": "c) Envelopper les viscères dans un champ stérile humidifié",
          "isCorrect": true,
          "comment": "L'enveloppement des viscères dans un champ stérile humidifié aide à les protéger contre la contamination et la dessiccation."
      },
      {
          "text": "d) Ne rien faire",
          "isCorrect": false,
          "comment": "L'éviscération nécessite une intervention médicale immédiate pour éviter des complications."
      }
  ]
},
{
  "text": "5. Que doit-on faire en cas de vomissements de sang rouge (hématémèse) ?",
  "answers": [
      {
          "text": "a) Donner à boire à la victime",
          "isCorrect": false,
          "comment": "Les vomissements de sang nécessitent une évaluation médicale immédiate, et non l'administration de liquides."
      },
      {
          "text": "b) Examiner la plaie pour identifier la source du sang",
          "isCorrect": true,
          "comment": "Identifier la source des saignements est essentiel pour déterminer le traitement approprié."
      },
      {
          "text": "c) Consulter un ophtalmologiste",
          "isCorrect": false,
          "comment": "Un ophtalmologiste traite les problèmes oculaires, pas les vomissements de sang."
      },
      {
          "text": "d) Protéger la victime contre le froid",
          "isCorrect": false,
          "comment": "Protéger contre le froid n'est pas une priorité dans ce cas."
      }
  ]
},
{
  "text": "6. Quelle est la première étape à réaliser en présence d'une plaie abdominale ?",
  "answers": [
      {
          "text": "a) Examiner la plaie pour déterminer sa gravité",
          "isCorrect": false,
          "comment": "La première étape consiste à assurer la sécurité de la victime et à la placer dans une position qui minimise les risques de complications."
      },
      {
          "text": "b) Retirer immédiatement le corps étranger pénétrant",
          "isCorrect": false,
          "comment": "Retirer un corps étranger peut aggraver les lésions internes. La priorité est de stabiliser la victime."
      },
      {
          "text": "c) Mettre la victime dans une position allongée, à plat dos, jambes fléchies",
          "isCorrect": true,
          "comment": "Cette position aide à soulager la pression sur l'abdomen et à prévenir d'autres dommages."
      },
      {
          "text": "d) Rechercher l'existence de lésions dans le dos de la victime",
          "isCorrect": false,
          "comment": "Bien qu'il soit important de rechercher des lésions, cela ne devrait pas être la première étape."
      }
  ]
},
{
  "text": "9. Pourquoi ne doit-on jamais retirer un corps étranger pénétrant dans l'abdomen ?",
  "answers": [
      {
          "text": "a) Pour éviter une infection",
          "isCorrect": false,
          "comment": "Bien que l'infection soit une préoccupation, le principal risque est d'aggraver les lésions internes en retirant le corps étranger."
      },
      {
          "text": "b) Pour prévenir la détresse respiratoire",
          "isCorrect": false,
          "comment": "La détresse respiratoire n'est pas directement liée au retrait ou à la présence du corps étranger dans l'abdomen."
      },
      {
          "text": "c) Pour limiter les saignements",
          "isCorrect": false,
          "comment": "Le retrait du corps étranger peut réellement augmenter les saignements en aggravant les lésions."
      },
      {
          "text": "d) Pour éviter d'aggraver les lésions internes",
          "isCorrect": true,
          "comment": "Retirer un corps étranger pénétrant peut causer davantage de dommages en provoquant des saignements ou en perforant davantage les organes."
      }
  ]
},
{
  "text": "13. Quelle est la conduite à tenir en présence d'une plaie abdominale chez une victime présentant une détresse vitale ?",
  "answers": [
      {
          "text": "a) Mettre la victime dans une position assise",
          "isCorrect": false,
          "comment": "Une position allongée est généralement recommandée pour les victimes présentant une détresse vitale."
      },
      {
          "text": "b) Appliquer un pansement stérile",
          "isCorrect": false,
          "comment": "Bien qu'un pansement puisse être nécessaire, il ne doit pas être appliqué avant une évaluation médicale approfondie."
      },
      {
          "text": "c) Envelopper les viscères dans un champ stérile humidifié",
          "isCorrect": false,
          "comment": "Cela peut être nécessaire, mais la priorité est de stabiliser la victime dans un état critique."
      },
      {
          "text": "d) Appliquer la conduite à tenir adaptée à son état",
          "isCorrect": true,
          "comment": "La conduite à tenir doit être adaptée à l'état spécifique de la victime, en se concentrant sur la stabilisation et le traitement des problèmes vitaux."
      }
  ]
},
{
  "text": "15. Quelle est la principale raison pour laquelle toute plaie abdominale est considérée comme grave ?",
  "answers": [
      {
          "text": "a) Risque d'infection généralisée",
          "isCorrect": false,
          "comment": "Bien que l'infection soit une préoccupation, la gravité de la plaie réside principalement dans le risque d'hémorragie interne."
      },
      {
          "text": "b) Risque d'hypotension",
          "isCorrect": false,
          "comment": "L'hypotension peut résulter d'une hémorragie interne, mais ce n'est pas la principale raison pour laquelle la plaie est considérée comme grave."
      },
      {
          "text": "c) Risque de lésions nerveuses",
          "isCorrect": false,
          "comment": "Les lésions nerveuses peuvent survenir, mais la gravité de la plaie est principalement liée au risque d'hémorragie interne."
      },
      {
          "text": "d) Risque d'hémorragie interne",
          "isCorrect": true,
          "comment": "La principale préoccupation avec les plaies abdominales est le risque d'hémorragie interne, ce qui peut être mortel s'il n'est pas traité rapidement."
      }
  ]
},

{
  "text": "17. Pourquoi doit-on demander un avis médical en présence d'une éviscération ?",
  "answers": [
      {
          "text": "a) Pour administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que la gestion de la douleur soit importante, ce n'est pas la principale raison de demander un avis médical."
      },
      {
          "text": "b) Pour obtenir des conseils sur la nutrition",
          "isCorrect": false,
          "comment": "La nutrition n'est pas la principale préoccupation lorsqu'il s'agit d'une éviscération."
      },
      {
          "text": "c) Pour planifier une intervention chirurgicale",
          "isCorrect": true,
          "comment": "Une éviscération nécessite souvent une intervention chirurgicale immédiate pour réparer les dommages et protéger les organes."
      },
      {
          "text": "d) Pour évaluer la gravité de la blessure",
          "isCorrect": false,
          "comment": "L'évaluation de la gravité est importante, mais la priorité initiale est de planifier une intervention chirurgicale pour traiter l'éviscération."
      }
  ]
},
{
  "text": "18. Quel est le geste à éviter en présence d'une éviscération ?",
  "answers": [
      {
          "text": "a) Envelopper les viscères dans un champ stérile humidifié",
          "isCorrect": false,
          "comment": "Envelopper les viscères dans un champ stérile est une étape importante pour protéger les organes exposés."
      },
      {
          "text": "b) Remettre les viscères en place",
          "isCorrect": true,
          "comment": "Remettre les viscères en place peut aggraver les dommages et augmenter le risque d'infection."
      },
      {
          "text": "c) Mobiliser les viscères",
          "isCorrect": false,
          "comment": "Mobiliser les viscères peut aggraver les blessures. Il est important de les garder aussi immobiles que possible."
      },
      {
          "text": "d) Compresser les viscères",
          "isCorrect": false,
          "comment": "Compresser les viscères peut augmenter les dommages et causer plus de douleur à la victime."
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
