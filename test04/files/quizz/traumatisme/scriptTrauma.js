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
  {"text": "Que faut-il faire en cas de traumatisme dentaire ?",
    "answers": [
        {
        "text": "Faire avaler à la victime de l'eau de javel",
        "isCorrect": false,
        "comment": "Faire avaler de l'eau de javel à la victime peut être dangereux. Il est important de consulter un professionnel de la santé."
        },
        {
            "text": "Rincer la dent tombée pendant 1 minute sous l'eau courante",
            "isCorrect": false,
            "comment": "Rincer la dent tombée sous l'eau courante peut endommager les tissus. La dent doit être manipulée avec précaution."
        },
        {
            "text": "Garder la dent dans de l'eau du robinet",
            "isCorrect": false,
            "comment": "Conserver la dent dans de l'eau du robinet n'est pas recommandé. Elle devrait plutôt être placée dans du lait ou dans une solution saline."
        },
        {
            "text": "Consulter immédiatement un chirurgien-dentiste",
            "isCorrect": true,
            "comment": "En cas de traumatisme dentaire, il est crucial de consulter immédiatement un professionnel de la santé dentaire pour évaluer la blessure et fournir un traitement approprié."
        }
    ]
},
{
  "text": "Quelle est la conduite à tenir en présence d'un traumatisme dentaire avec délogement d'une dent ?",
  "answers": [
      {
          "text": "Faire boire de l'eau froide à la victime",
          "isCorrect": false,
          "comment": "Faire boire de l'eau froide à la victime n'est pas la conduite à tenir en cas de traumatisme dentaire avec délogement d'une dent."
      },
      {
          "text": "Rincer la dent tombée avec du savon",
          "isCorrect": false,
          "comment": "Rincer la dent avec du savon n'est pas recommandé, car cela peut contaminer la dent."
      },
      {
          "text": "Recueillir la dent tombée et la transporter avec la victime dans du serum phy",
          "isCorrect": true,
          "comment": "En cas de traumatisme dentaire avec délogement d'une dent, il est important de recueillir la dent tombée et de la transporter avec la victime pour une éventuelle réimplantation."
      },
      {
          "text": "Laisser la dent sur le sol et appeler immédiatement les secours",
          "isCorrect": false,
          "comment": "Il est important de recueillir la dent tombée pour éviter sa perte et de contacter immédiatement les secours pour obtenir des conseils supplémentaires."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en cas de traumatisme dentaire ?",
  "answers": [
      {
          "text": "Demander à la victime de boire de l'alcool pour désinfecter la plaie",
          "isCorrect": false,
          "comment": "Boire de l'alcool ne désinfectera pas la plaie et peut même aggraver la situation en altérant l'état de la victime."
      },
      {
          "text": "Demander à la victime de garder la dent tombée dans de l'eau du robinet",
          "isCorrect": false,
          "comment": "Garder la dent dans de l'eau du robinet peut endommager les tissus de la dent et réduire les chances de la réimplanter avec succès."
      },
      {
          "text": "Demander à la victime de se rincer la bouche avec de l'eau",
          "isCorrect": true,
          "comment": "Rincer la bouche avec de l'eau peut aider à éliminer les débris et à réduire le risque d'infection après un traumatisme dentaire."
      },
      {
          "text": "Demander à la victime de ne pas consulter de médecin",
          "isCorrect": false,
          "comment": "Il est important de consulter un médecin ou un dentiste dès que possible en cas de traumatisme dentaire pour évaluer les dommages et administrer un traitement approprié."
      }
  ]
},
{
  "text": "Quelles sont les principales causes de traumatisme abdominal ?",
  "answers": [
      {
          "text": "Piqûre d'insecte",
          "isCorrect": false,
          "comment": "Les piqûres d'insectes ne sont généralement pas des causes majeures de traumatisme abdominal."
      },
      {
          "text": "Explosion",
          "isCorrect": true,
          "comment": "Les explosions peuvent causer des traumatismes abdominaux graves."
      },
      {
          "text": "Éruption volcanique",
          "isCorrect": false,
          "comment": "Les éruptions volcaniques sont peu susceptibles de causer des traumatismes abdominaux."
      },
      {
          "text": "Brûlure chimique",
          "isCorrect": false,
          "comment": "Les brûlures chimiques peuvent causer des lésions cutanées, mais pas nécessairement des traumatismes abdominaux."
      }
  ]
},
{
  "text": "Quel risque est associé aux traumatismes avec atteinte des organes creux ?",
  "answers": [
      {
          "text": "Risque de détresse respiratoire",
          "isCorrect": false,
          "comment": "Bien que la détresse respiratoire puisse être une complication, le risque principal est l'infection due à la perforation des organes."
      },
      {
          "text": "Risque d'hypothermie",
          "isCorrect": false,
          "comment": "Le risque principal est l'infection, pas l'hypothermie."
      },
      {
          "text": "Risque infectieux",
          "isCorrect": true,
          "comment": "Les traumatismes avec atteinte des organes creux augmentent le risque d'infection."
      },
      {
          "text": "Risque de fracture",
          "isCorrect": false,
          "comment": "Les organes creux ne peuvent pas subir de fracture."
      }
  ]
},
{
  "text": "Comment peut se manifester une éviscération ?",
  "answers": [
      {
          "text": "Par des douleurs aux membres",
          "isCorrect": false,
          "comment": "Une éviscération implique l'exposition des viscères à l'extérieur de l'abdomen, pas de douleurs aux membres."
      },
      {
          "text": "Par des vomissements répétés",
          "isCorrect": false,
          "comment": "Les vomissements répétés ne sont pas une manifestation typique d'une éviscération."
      },
      {
          "text": "Par des vomissements de sang",
          "isCorrect": false,
          "comment": "Les vomissements de sang peuvent indiquer d'autres conditions, mais pas nécessairement une éviscération."
      },
      {
          "text": "Par une exposition des viscères à l'extérieur de l'abdomen",
          "isCorrect": true,
          "comment": "Une éviscération se produit lorsque les viscères sont exposés à l'extérieur de l'abdomen."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en présence d'une éviscération ?",
  "answers": [
      {
          "text": "Remettre immédiatement les viscères en place",
          "isCorrect": false,
          "comment": "Remettre les viscères en place sans les précautions nécessaires peut aggraver les blessures."
      },
      {
          "text": "Utiliser des compresses pour comprimer les viscères",
          "isCorrect": false,
          "comment": "Comprimer les viscères peut entraîner des dommages supplémentaires. Il est préférable de les protéger avec un champ stérile."
      },
      {
          "text": "Envelopper les viscères dans un champ stérile humidifié",
          "isCorrect": true,
          "comment": "L'enveloppement des viscères dans un champ stérile humidifié aide à les protéger contre la contamination et la dessiccation."
      },
      {
          "text": "Ne rien faire",
          "isCorrect": false,
          "comment": "L'éviscération nécessite une intervention médicale immédiate pour éviter des complications."
      }
  ]
},
{
  "text": "Pourquoi faut-il protéger la victime contre le froid, le vent ou la chaleur en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "Pour éviter la propagation de l'infection",
          "isCorrect": false,
          "comment": "La protection contre le froid, le vent ou la chaleur vise principalement à prévenir l'hypothermie ou l'hyperthermie."
      },
      {
          "text": "Pour prévenir l'hypothermie ou l'hyperthermie",
          "isCorrect": true,
          "comment": "Le traumatisme abdominal peut perturber la régulation de la température corporelle, ce qui rend la protection contre les températures extrêmes importante."
      },
      {
          "text": "Pour éviter les réactions allergiques",
          "isCorrect": false,
          "comment": "Les réactions allergiques ne sont pas liées directement au traumatisme abdominal."
      },
      {
          "text": "Pour empêcher la détérioration de la plaie",
          "isCorrect": false,
          "comment": "La protection contre les éléments vise à maintenir la stabilité de la température corporelle, pas à prévenir la détérioration de la plaie."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir spécifique pour toute femme enceinte victime d'un traumatisme violent ?",
  "answers": [
      {
          "text": "La faire marcher pour favoriser la circulation sanguine",
          "isCorrect": false,
          "comment": "Marcher peut aggraver les blessures chez une femme enceinte victime d'un traumatisme violent."
      },
      {
          "text": "La placer en position assise pour soulager la pression abdominale",
          "isCorrect": false,
          "comment": "La position assise peut mettre davantage de pression sur l'abdomen. Une évaluation médicale immédiate est nécessaire."
      },
      {
          "text": "La considérer comme traumatisée de l'abdomen et la faire consulter dans un service d'urgence ou spécialisé",
          "isCorrect": true,
          "comment": "Toute femme enceinte victime d'un traumatisme violent doit être considérée comme présentant un risque pour le fœtus et doit être évaluée immédiatement par un professionnel de la santé."
      },
      {
          "text": "Appliquer un pansement stérile sur l'abdomen pour protéger le fœtus",
          "isCorrect": false,
          "comment": "L'application d'un pansement ne suffit pas. Une évaluation médicale complète est nécessaire."
      }
  ]
},
{
  "text": "Quelle est la priorité dans l'action de secours en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "Identifier la gravité de la plaie",
          "isCorrect": false,
          "comment": "Bien qu'il soit important d'évaluer la plaie, la priorité est de prévenir toute détresse circulatoire en surveillant attentivement la victime."
      },
      {
          "text": "Installer ou transporter la victime dans une position d'attente adaptée",
          "isCorrect": false,
          "comment": "La première priorité est de stabiliser la victime dans la position la plus confortable pour prévenir d'autres dommages."
      },
      {
          "text": "Examiner la victime pour rechercher des lésions",
          "isCorrect": false,
          "comment": "Bien qu'il soit nécessaire d'examiner la victime, la priorité initiale est de prévenir toute détresse circulatoire."
      },
      {
          "text": "Prévenir toute détresse circulatoire par une surveillance attentive",
          "isCorrect": true,
          "comment": "La priorité est de surveiller attentivement la victime pour détecter et traiter rapidement toute détresse circulatoire."
      }
  ]
},
{
  "text": "Quels sont les trois types principaux de causes de traumatisme abdominal énumérés dans le texte ?",
  "answers": [
      {
          "text": "Choc électrique, brûlure chimique, gelure",
          "isCorrect": false,
          "comment": "Ces éléments ne sont pas des causes principales de traumatisme abdominal."
      },
      {
          "text": "Explosion, chute de grande hauteur, accident de vélo",
          "isCorrect": false,
          "comment": "Bien que ces événements puissent causer des blessures, ils ne sont pas les principales causes de traumatisme abdominal énumérées."
      },
      {
          "text": "Pénétration d'un corps étranger, traumatisme direct, décélération brusque",
          "isCorrect": true,
          "comment": "Ce sont en effet les principaux types de causes de traumatisme abdominal énumérés."
      },
      {
          "text": "Éruption volcanique, avalanche, tremblement de terre",
          "isCorrect": false,
          "comment": "Ces événements peuvent causer des traumatismes, mais ils ne sont pas spécifiquement liés aux traumatismes abdominaux."
      }
  ]
},
{
  "text": "Quel est le risque associé aux traumatismes avec atteinte des gros vaisseaux abdominaux ?",
  "answers": [
      {
          "text": "Risque de brûlures",
          "isCorrect": false,
          "comment": "Les gros vaisseaux abdominaux ne sont pas associés aux brûlures, mais plutôt aux hémorragies internes."
      },
      {
          "text": "Risque de détresse circulatoire par hémorragie interne",
          "isCorrect": true,
          "comment": "Les blessures aux gros vaisseaux abdominaux peuvent entraîner une perte de sang importante et une détresse circulatoire."
      },
      {
          "text": "Risque de lésions nerveuses",
          "isCorrect": false,
          "comment": "Les gros vaisseaux abdominaux ne sont pas associés aux lésions nerveuses, mais plutôt aux hémorragies et à la détresse circulatoire."
      },
      {
          "text": "Risque de détresse respiratoire",
          "isCorrect": false,
          "comment": "Les problèmes respiratoires ne sont pas directement liés aux traumatismes des gros vaisseaux abdominaux."
      }
  ]
},
{
  "text": "Pourquoi faut-il rechercher l'existence de lésions dans le dos de la victime en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "Pour vérifier si la victime peut marcher",
          "isCorrect": false,
          "comment": "La capacité de marcher n'est pas la principale préoccupation lors de la recherche de lésions dans le dos."
      },
      {
          "text": "Pour évaluer la gravité de la plaie",
          "isCorrect": false,
          "comment": "L'évaluation de la gravité de la plaie se concentre sur la zone abdominale, pas nécessairement sur le dos."
      },
      {
          "text": "Pour identifier d'autres sources de douleur",
          "isCorrect": true,
          "comment": "Les lésions dans le dos peuvent indiquer d'autres traumatismes ou fractures qui pourraient être liés au traumatisme abdominal."
      },
      {
          "text": "Pour appliquer un traitement spécifique aux lésions du dos",
          "isCorrect": false,
          "comment": "L'identification des lésions dans le dos est principalement pour évaluer l'étendue des dommages et planifier le traitement global, pas seulement pour les lésions du dos."
      }
  ]
},
{
  "text": "Quel est le pourcentage approximatif de mortalité des traumatismes du bassin ?",
  "answers": [
      {
          "text": "2-5%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus élevé, allant jusqu'à environ 8-15%."
      },
      {
          "text": "5-8%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus élevé, allant jusqu'à environ 8-15%."
      },
      {
          "text": "8-15%",
          "isCorrect": true,
          "comment": "Le taux de mortalité des traumatismes du bassin se situe généralement dans cette plage, allant jusqu'à environ 8-15%."
      },
      {
          "text": "15-20%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus bas que cela, se situant autour de 8-15%."
      }
  ]
},
{
  "text": "Quel signe évoque un traumatisme du bassin si la victime peut s'exprimer ?",
  "answers": [
      {
          "text": "Douleur dans les bras",
          "isCorrect": false,
          "comment": "La douleur dans les bras n'est pas spécifique aux traumatismes du bassin."
      },
      {
          "text": "Douleur dans le cou",
          "isCorrect": false,
          "comment": "La douleur dans le cou n'est pas spécifique aux traumatismes du bassin."
      },
      {
          "text": "Douleur dans le bassin ou la partie basse de l'abdomen",
          "isCorrect": true,
          "comment": "La douleur dans le bassin ou la partie basse de l'abdomen peut être un signe de traumatisme à cette région."
      },
      {
          "text": "Douleur dans les jambes",
          "isCorrect": false,
          "comment": "La douleur dans les jambes n'est pas spécifique aux traumatismes du bassin."
      }
  ]
},
{
  "text": "Quel élément ne fait pas partie des signes observables lors de l'examen d'une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "Douleur du bassin",
          "isCorrect": false,
          "comment": "La douleur du bassin est souvent un signe observable d'un traumatisme à cette région."
      },
      {
          "text": "Impossibilité de bouger les membres inférieurs",
          "isCorrect": false,
          "comment": "L'impossibilité de bouger les membres inférieurs peut être un signe observable de traumatisme du bassin."
      },
      {
          "text": "Respiration difficile",
          "isCorrect": true,
          "comment": "La respiration difficile n'est généralement pas un signe observable directement lié aux traumatismes du bassin."
      },
      {
          "text": "Urine sanglante ou présence de sang sur les sous-vêtements",
          "isCorrect": false,
          "comment": "La présence d'urine sanglante ou de sang sur les sous-vêtements peut indiquer un traumatisme du bassin."
      }
  ]
},
{
  "text": "Quelle action est recommandée en cas de détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "Appliquer un pansement sur la plaie",
          "isCorrect": false,
          "comment": "Bien qu'un pansement puisse être nécessaire, la détresse circulatoire doit être gérée en priorité."
      },
      {
          "text": "Mettre la victime en position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin avec détresse circulatoire."
      },
      {
          "text": "Immobiliser le bassin",
          "isCorrect": true,
          "comment": "Immobiliser le bassin peut aider à prévenir toute aggravation de la blessure et à stabiliser la victime."
      },
      {
          "text": "Appliquer de la chaleur sur la zone affectée",
          "isCorrect": false,
          "comment": "L'application de chaleur peut ne pas être appropriée, surtout en cas de suspicion d'hémorragie interne."
      }
  ]
},
{
  "text": "Quelle est la première mesure à prendre lors de l'action de secours pour une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "Installer la victime dans une position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin avec détresse circulatoire."
      },
      {
          "text": "Contacter les services d'urgence",
          "isCorrect": false,
          "comment": "Bien que contacter les services d'urgence soit essentiel, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "Prévenir toute détresse circulatoire par une surveillance attentive",
          "isCorrect": true,
          "comment": "Prévenir toute détresse circulatoire est essentiel pour assurer la stabilité de la victime."
      },
      {
          "text": "Examiner les membres supérieurs",
          "isCorrect": false,
          "comment": "Bien que l'examen des membres supérieurs puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Pourquoi est-il recommandé de dénuder le bassin de la victime lors de l'action de secours ?",
  "answers": [
      {
          "text": "Pour vérifier la présence de lésions et de sang sur les sous-vêtements",
          "isCorrect": true,
          "comment": "Cela permet d'évaluer les dommages potentiels et d'identifier toute blessure cachée."
      },
      {
          "text": "Pour faciliter la respiration de la victime",
          "isCorrect": false,
          "comment": "Bien que la respiration soit importante, ce n'est pas la principale raison de dénuder le bassin."
      },
      {
          "text": "Pour réduire la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse aider, ce n'est pas la principale raison de dénuder le bassin."
      },
      {
          "text": "Pour identifier d'autres blessures sur le corps",
          "isCorrect": false,
          "comment": "L'identification d'autres blessures est un avantage, mais ce n'est pas la principale raison de dénuder le bassin."
      }
  ]
},
{
  "text": "Quelle est la mesure recommandée si la victime présente un traumatisme du bassin associé à des signes de détresse circulatoire ?",
  "answers": [
      {
          "text": "Appliquer un pansement compressif",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "Immobiliser la victime",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse circulatoire."
      },
      {
          "text": "Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la région et à prévenir toute aggravation de la blessure."
      },
      {
          "text": "Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Comment doit être protégée une victime de traumatisme du bassin contre les éléments environnementaux ?",
  "answers": [
      {
          "text": "En l'isolant dans une pièce calme",
          "isCorrect": false,
          "comment": "Isoler la victime dans une pièce calme peut ne pas être pratique dans toutes les situations d'urgence."
      },
      {
          "text": "En la recouvrant d'une couverture",
          "isCorrect": true,
          "comment": "Recouvrir la victime d'une couverture peut aider à maintenir sa chaleur corporelle et à prévenir l'hypothermie."
      },
      {
          "text": "En la plaçant à l'ombre",
          "isCorrect": false,
          "comment": "Placer la victime à l'ombre peut être bénéfique, mais ce n'est pas la principale mesure pour la protéger contre les éléments environnementaux."
      },
      {
          "text": "En la massant",
          "isCorrect": false,
          "comment": "Masser la victime peut ne pas être approprié dans le contexte d'un traumatisme du bassin."
      }
  ]
},
{
  "text": "Quel est l'objectif de limiter toute mobilisation de la victime, sauf en cas de nécessité absolue, dans l'action de secours pour un traumatisme du bassin ?",
  "answers": [
      {
          "text": "Pour éviter la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être un résultat, l'objectif principal est de prévenir toute aggravation de la blessure."
      },
      {
          "text": "Pour éviter toute aggravation de la blessure",
          "isCorrect": true,
          "comment": "Limiter la mobilisation peut aider à prévenir des dommages supplémentaires au bassin et aux structures environnantes."
      },
      {
          "text": "Pour faciliter le transport de la victime",
          "isCorrect": false,
          "comment": "Le transport de la victime peut nécessiter une mobilisation, mais la priorité est d'éviter toute aggravation de la blessure."
      },
      {
          "text": "Pour permettre à la victime de se reposer",
          "isCorrect": false,
          "comment": "Bien que le repos soit important, limiter la mobilisation vise principalement à prévenir toute aggravation de la blessure."
      }
  ]
},
{
  "text": "Que doit-on rechercher en particulier lors de la dénudation du bassin de la victime ?",
  "answers": [
      {
          "text": "La présence de lésions sur le visage",
          "isCorrect": false,
          "comment": "Bien que la vérification des blessures soit importante, le visage n'est pas directement lié au traumatisme du bassin."
      },
      {
          "text": "La présence de lésions dans le dos ou au niveau des fesses",
          "isCorrect": true,
          "comment": "Les lésions dans le dos ou au niveau des fesses peuvent indiquer des blessures potentielles au bassin ou à la colonne vertébrale."
      },
      {
          "text": "La présence de lésions sur les membres supérieurs",
          "isCorrect": false,
          "comment": "Bien que cela puisse être important, le focus principal est sur le bassin et les régions environnantes."
      },
      {
          "text": "La présence de lésions sur les chevilles",
          "isCorrect": false,
          "comment": "Bien que cela puisse être important, le focus principal est sur le bassin et les régions environnantes."
      }
  ]
},
{
  "text": "Quelle est la recommandation en cas d'impossibilité d'obtenir un avis médical pour une victime de traumatisme du bassin présentant des signes de détresse circulatoire ?",
  "answers": [
      {
          "text": "Attendre l'arrivée des secours sans intervention",
          "isCorrect": false,
          "comment": "En cas de détresse circulatoire, des mesures doivent être prises pour stabiliser la victime jusqu'à l'arrivée des secours."
      },
      {
          "text": "Immobiliser la victime sans aucune autre mesure",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse circulatoire."
      },
      {
          "text": "Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la victime en attendant l'arrivée des secours médicaux."
      },
      {
          "text": "Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Quelle mesure supplémentaire est nécessaire en présence d'une détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "Demander à la victime de bouger ses membres",
          "isCorrect": false,
          "comment": "En cas de détresse vitale, d'autres mesures prioritaires doivent être prises pour stabiliser la victime."
      },
      {
          "text": "Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "La gestion de la douleur peut être nécessaire, mais il y a une autre mesure plus importante en cas de détresse vitale."
      },
      {
          "text": "Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la victime en cas de détresse vitale."
      },
      {
          "text": "Appliquer un pansement compressif",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une autre mesure plus importante en cas de détresse vitale."
      }
  ]
},
{
    "text": "Quelles sont les conséquences d'un choc direct au niveau de la tête ?",
    "answers": [
        {
            text: "Aucune",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Des lésions cutanées uniquement",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Des lésions cérébrales",
            isCorrect: true,
            comment: " Des lésions cérébrales"
        },
        {
            text: "Des fractures osseuses uniquement",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quel signe peut indiquer une possible fracture des os de la base du crâne ?",
    "answers": [
        {
            text: "Une perte de connaissance",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Un hématome en lunettes (autour des yeux)",
            isCorrect: true,
            comment: "Réponse correcte : Un hématome en lunettes (autour des yeux)"
        },
        {
            text: "Une asymétrie pupillaire nette et fixe",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Une douleur au niveau des os du crâne",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Qu'est-ce que l'on doit faire en cas d'otorragie (écoulement de sang de l'oreille) ?",
    "answers": [
        {
            text: "Comprimer manuellement l'oreille",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Ne rien faire, c'est souvent sans gravité",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Nettoyer l'oreille avec une compresse",
            isCorrect: true,
            comment: "Réponse correcte : Nettoyer l'oreille avec une compresse"
        },
        {
            text: "Appliquer de la glace sur l'oreille",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Qu'est-ce qui peut indiquer une possible lésion associée en particulier de la colonne cervicale ?",
    "answers": [
        {
            text: "Des nausées",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Des vomissements",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Une perte de mémoire des faits",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Un déficit moteur neurologique",
            isCorrect: true,
            comment: "Réponse correcte : Un déficit moteur neurologique"
        }
    ]
},
{
    "text": "Qu'est-ce que l'intervalle libre ?",
    "answers": [
        {
            text: "Un moment où la victime se sent mieux après l'accident",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Une période de perte de conscience après l'accident",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Un intervalle de temps entre l'accident et l'apparition de troubles de conscience",
            isCorrect: true,
            comment: "Réponse correcte : Un intervalle de temps entre l'accident et l'apparition de troubles de conscience"
        },
        {
            text: "Un laps de temps pendant lequel la victime peut se souvenir de l'accident",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Pourquoi toute chute d'un enfant d'une hauteur supérieure à sa taille doit-elle faire suspecter un traumatisme crânien ?",
    "answers": [
        {
            text: "Parce que les enfants ont tendance à tomber souvent",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Parce que leur tête est plus fragile que celle des adultes",
            isCorrect: true,
            comment: "Réponse correcte : Parce que leur tête est plus fragile que celle des adultes"
        },
        {
            text: "Parce que cela peut entraîner des troubles du comportement",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Parce que les enfants sont plus susceptibles de se blesser",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelle est la première action recommandée en cas de suspicion de lésion du rachis ?",
    "answers": [
        {
            text: "Appliquer de la glace sur la zone affectée",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "ne pas mobiliser la victime",
            isCorrect: true,
            comment: "Réponse correcte : Immobiliser la victime"
        },
        {
            text: "Demander à la victime de bouger pour voir si elle ressent de la douleur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Administrer de l'oxygène en inhalation",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelles sont les conséquences possibles d'une décélération brutale de la tête sans choc sur un obstacle ?",
    "answers": [
        {
            "text": "Aucune",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des lésions cutanées",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des lésions cérébrales",
            "isCorrect": true,
            "comment": "Réponse correcte : Des lésions cérébrales"
        },
        {
            "text": "Des fractures osseuses",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quel signe peut indiquer une possible lésion du rachis cervical ?",
    "answers": [
        {
            "text": "Une perte de connaissance",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des convulsions",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Une asymétrie pupillaire nette et fixe",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Un déficit moteur neurologique",
            "isCorrect": true,
            "comment": "Réponse correcte : Un déficit moteur neurologique"
        }
    ]
},
{
    "text": "Que peut faire l'intervenant en cas de besoin de stabilisation ou de restriction des mouvements du rachis cervical ?",
    "answers": [
        {
            "text": "Administrer des médicaments contre la douleur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Appliquer un collier cervical",
            "isCorrect": true,
            "comment": "Réponse correcte : Appliquer un collier cervical"
        },
        {
            "text": "Demander à la victime de bouger pour voir si elle ressent de la douleur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Ne rien faire, cela pourrait aggraver la situation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Qu'est-ce qui peut indiquer la survenue d'une perte de connaissance secondaire ?",
    "answers": [
        {
            "text": "Des troubles de la conscience apparaissant plusieurs minutes à plusieurs heures après l'accident",
            "isCorrect": true,
            "comment": "Réponse correcte : Des troubles de la conscience apparaissant plusieurs minutes à plusieurs heures après l'accident peuvent indiquer une perte de connaissance secondaire."
        },
        {
            "text": "Une asymétrie pupillaire nette et fixe",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une asymétrie pupillaire est souvent associée à d'autres problèmes neurologiques mais pas spécifiquement à une perte de conscience secondaire."
        },
        {
            "text": "Une perte de mémoire des faits",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une perte de mémoire des faits peut indiquer divers types de lésions cérébrales mais pas nécessairement une perte de conscience secondaire."
        },
        {
            "text": "Une douleur spontanée au niveau des os du crâne",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La douleur spontanée au niveau des os du crâne peut être un symptôme d'autres problèmes, mais pas spécifiquement d'une perte de conscience secondaire."
        }
    ]
},
{
    "text": "Pourquoi doit-on surveiller régulièrement l'état de conscience de la victime ?",
    "answers": [
        {
            "text": "Pour lui administrer des médicaments",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'administration de médicaments ne devrait être faite que par des professionnels de la santé en fonction de l'évaluation de la situation médicale de la victime."
        },
        {
            "text": "Pour évaluer si la victime a besoin de se reposer",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Bien que le repos puisse être nécessaire dans certains cas, surveiller l'état de conscience de la victime est crucial pour détecter une éventuelle détérioration de son état de santé."
        },
        {
            "text": "Pour détecter une éventuelle aggravation de son état",
            "isCorrect": true,
            "comment": "Réponse correcte : La surveillance régulière de l'état de conscience de la victime est essentielle pour détecter tout signe d'aggravation de son état de santé, ce qui pourrait nécessiter une intervention médicale immédiate."
        },
        {
            "text": "Pour la distraire de la douleur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Surveiller l'état de conscience de la victime ne vise pas à la distraire de la douleur, mais à évaluer son niveau de conscience et d'alerte."
        }
    ]
},
{
    "text": "Que peut indiquer une plaie du cuir chevelu ?",
    "answers": [
        {
            "text": "Une possible lésion cérébrale",
            "isCorrect": true,
            "comment": "Réponse correcte : Une plaie du cuir chevelu peut indiquer une possible lésion cérébrale sous-jacente, nécessitant une évaluation médicale approfondie."
        },
        {
            "text": "Une possible lésion de la colonne cervicale",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les plaies du cuir chevelu ne sont pas directement liées aux lésions de la colonne cervicale."
        },
        {
            "text": "Une possible lésion du rachis cervical",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les plaies du cuir chevelu ne sont pas des indicateurs directs de lésions du rachis cervical."
        },
        {
            "text": "Une possible lésion de la colonne vertébrale",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Bien que certaines plaies du cuir chevelu puissent s'accompagner de lésions de la colonne vertébrale, cela n'est pas spécifiquement indiqué par la présence d'une plaie du cuir chevelu."
        }
    ]
},
{
    "text": "Comment doit-on protéger la victime contre le froid, la chaleur ou les intempéries ?",
    "answers": [
        {
            "text": "En lui donnant à boire",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Donner à boire à la victime ne contribue pas directement à la protection contre le froid, la chaleur ou les intempéries. L'hydratation est importante, mais ce n'est pas la réponse appropriée à cette question spécifique."
        },
        {
            "text": "En l'isolant avec des couvertures ou des vêtements",
            "isCorrect": true,
            "comment": "Réponse correcte : La meilleure façon de protéger la victime contre le froid, la chaleur ou les intempéries est de l'isoler avec des couvertures ou des vêtements supplémentaires pour maintenir sa température corporelle."
        },
        {
            "text": "En la plaçant à l'ombre",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Bien que placer la victime à l'ombre puisse aider à réduire l'exposition directe au soleil, cela ne constitue pas une protection suffisante contre le froid ou les intempéries."
        },
        {
            "text": "En laissant les fenêtres ouvertes",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Laisser les fenêtres ouvertes n'aidera pas à protéger la victime contre le froid, la chaleur ou les intempéries. Cela peut même aggraver la situation en exposant davantage la victime aux éléments extérieurs."
        }
    ]
},
{
    "text": "Quelle est la conduite à tenir devant une victime suspecte d'un traumatisme crânien et qui respire ?",
    "answers": [
        {
            "text": "Appeler les secours et attendre leur arrivée",
            "isCorrect": true,
            "comment": "Réponse correcte : La première action recommandée en présence d'une victime suspecte d'un traumatisme crânien et qui respire est d'appeler les secours et d'attendre leur arrivée pour une évaluation médicale appropriée."
        },
        {
            "text": "Immobiliser la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'immobilisation de la victime pourrait aggraver les lésions si elles existent déjà et n'est pas la première étape recommandée dans ce cas."
        },
        {
            "text": "Administrer de l'oxygène en inhalation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'administration d'oxygène ne devrait être entreprise que par des professionnels de la santé après une évaluation médicale complète."
        },
        {
            "text": "Rien, car la victime respire",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Même si la victime respire, tout traumatisme crânien doit être évalué par des professionnels de la santé pour exclure toute lésion cérébrale potentiellement grave."
        }
    ]
},
{
    "text": "Que doit faire l'intervenant en cas de plainte de la victime de nausées ou de vomissements ?",
    "answers": [
    {
        "text": "Lui donner à boire",
        "isCorrect": false,
        "comment": "Ce n'est pas la bonne réponse. Donner à boire à une victime de nausées ou de vomissements peut aggraver son état. L'hydratation orale n'est pas recommandée dans ce cas, car cela pourrait augmenter le risque de vomissements supplémentaires."
    },
    {
        "text": "Lui administrer des médicaments contre la douleur",
        "isCorrect": false,
        "comment": "Ce n'est pas la bonne réponse. L'administration de médicaments doit être réservée aux professionnels de la santé et basée sur une évaluation médicale appropriée. Les nausées ou les vomissements peuvent être des symptômes de diverses affections, et l'automédication n'est pas recommandée sans avis médical."
    },
    {
        "text": "Lui mettre une compresse froide sur le front",
        "isCorrect": false,
        "comment": "Ce n'est pas la bonne réponse. Bien que l'application d'une compresse froide puisse être utile dans certains cas pour soulager les symptômes de nausées ou de vomissements, elle ne traite pas la cause sous-jacente. Il est essentiel de surveiller attentivement la victime et de rechercher une aide médicale si les symptômes persistent ou s'aggravent."
    },
    {
        "text": "Surveiller attentivement la victime",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de plainte de la victime de nausées ou de vomissements, il est essentiel de surveiller attentivement la victime pour détecter tout signe de détérioration de son état. Les nausées ou les vomissements peuvent être des symptômes de problèmes plus graves nécessitant une intervention médicale, il est donc important de rester vigilant et de rechercher une aide médicale si nécessaire."
    }
]
},
{
    "text": "Qu'est-ce qu'un traumatisme du dos et du cou ?",
    "answers": [
        {
            "text": "Une lésion uniquement au niveau du cou",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un traumatisme du dos et du cou peut affecter différentes parties de la colonne vertébrale."
        },
        {
            "text": "Une lésion à type d'entorse au niveau du dos",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un traumatisme du dos et du cou peut impliquer diverses lésions, pas seulement une entorse."
        },
        {
            "text": "Une lésion à type de fracture, de luxation ou de tassement pouvant survenir à n'importe quel niveau de la colonne vertébrale",
            "isCorrect": true,
            "comment": "Réponse correcte : Un traumatisme du dos et du cou peut entraîner des fractures, des luxations ou des tassements à divers niveaux de la colonne vertébrale."
        },
        {
            "text": "Une lésion à type de fracture, de luxation ou de tassement qui peuvent siéger à n'importe quel niveau de la colonne vertébrale",
            "isCorrect": true,
            "comment": "Cette réponse est correcte, elle décrit les diverses lésions qui peuvent survenir dans un traumatisme du dos et du cou."
        }
    ]
},
{
    "text": "Quelles sont les causes et les mécanismes d'une atteinte de la colonne vertébrale ?",
    "answers": [
        {
            "text": "Seulement un choc direct sur la colonne vertébrale",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les atteintes de la colonne vertébrale peuvent résulter de divers mécanismes, y compris des traumatismes indirects."
        },
        {
            "text": "Un choc direct sur la colonne vertébrale ou un traumatisme indirect survenant à distance",
            "isCorrect": true,
            "comment": "Réponse correcte : Les atteintes de la colonne vertébrale peuvent résulter d'un choc direct ou de traumatismes indirects survenant à distance."
        },
        {
            "text": "Seulement une chute sur la tête",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les atteintes de la colonne vertébrale peuvent résulter de diverses causes, pas seulement d'une chute sur la tête."
        },
        {
            "text": "Seulement une chute de grande hauteur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les atteintes de la colonne vertébrale peuvent survenir dans divers scénarios, pas seulement lors de chutes de grande hauteur."
        }
    ]
},
{
    "text": "Quels sont les risques et les conséquences d'un traumatisme de la colonne vertébrale ?",
    "answers": [
        {
            "text": "Uniquement une douleur légère au niveau du dos",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les traumatismes de la colonne vertébrale peuvent avoir des conséquences graves, y compris des lésions irréversibles."
        },
        {
            "text": "Uniquement une compression de la moelle épinière",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les traumatismes de la colonne vertébrale peuvent entraîner diverses complications, pas seulement une compression de la moelle épinière."
        },
        {
            "text": "La possible atteinte de la moelle épinière et des lésions irréversibles",
            "isCorrect": true,
            "comment": "Réponse correcte : Les traumatismes de la colonne vertébrale peuvent entraîner une atteinte de la moelle épinière et des lésions irréversibles."
        },
        {
            "text": "Aucune conséquence grave",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les traumatismes de la colonne vertébrale peuvent avoir des conséquences graves et potentiellement invalidantes."
        }
    ]
},
{
    "text": "Quels sont les signes d'un traumatisme du dos ou du cou ?",
    "answers": [
        {
            "text": "Une sensation de froid dans les membres",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les signes d'un traumatisme du dos ou du cou peuvent être différents de la sensation de froid dans les membres."
        },
        {
            "text": "Une diminution de la force musculaire dans les mains et les pieds",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les signes d'un traumatisme du dos ou du cou peuvent différer de la diminution de la force musculaire dans les mains et les pieds."
        },
        {
            "text": "Une douleur spontanée siégeant au niveau du rachis",
            "isCorrect": true,
            "comment": "Réponse correcte : La douleur au niveau du rachis est l'un des signes courants d'un traumatisme du dos ou du cou."
        },
        {
            "text": "Une raideur des genoux",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La raideur des genoux n'est pas spécifiquement associée aux traumatismes du dos ou du cou."
        }
    ]
},
{
    "text": "Quels sont les mécanismes qui font considérer la victime à haut risque de lésion du rachis ?",
    "answers": [
        {
            "text": "Une chute sur la tête d'une hauteur > 1 mètre",
            "isCorrect": true,
            "comment": "Réponse correcte : Une chute sur la tête d'une hauteur importante peut mettre la victime à haut risque de lésion du rachis."
        },
        {
            "text": "Une chute sur les mains d'une hauteur > 3 mètres",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les chutes sur les mains ne sont généralement pas associées à un risque élevé de lésion du rachis."
        },
        {
            "text": "Une marche brusque sur un sol inégal",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une marche brusque sur un sol inégal peut causer des blessures, mais ce n'est pas spécifiquement lié aux lésions du rachis."
        },
        {
            "text": "Un étirement musculaire léger",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un étirement musculaire léger n'est généralement pas associé à un risque élevé de lésion du rachis."
        }
    ]
},
{
    "text": "Que doit faire le secouriste dès lors qu'il suspecte un traumatisme du rachis ?",
    "answers": [
        {
            "text": "Demander à la victime de se lever immédiatement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Demander à la victime de se lever immédiatement peut aggraver les blessures potentielles au rachis."
        },
        {
            "text": "Demander à la victime de ne pas bouger",
            "isCorrect": true,
            "comment": "Réponse correcte : En cas de suspicion de traumatisme du rachis, il est important de demander à la victime de ne pas bouger pour éviter d'aggraver les lésions."
        },
        {
            "text": "Déplacer la victime pour mieux l'examiner",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Déplacer la victime peut augmenter les risques de lésions du rachis."
        },
        {
            "text": "Ignorer les plaintes de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Ignorer les plaintes de la victime peut entraîner des complications graves si un traumatisme du rachis est présent."
        }
    ]
},
{
    "text": "Quand suspecter une lésion du rachis lors du bilan ?",
    "answers": [
        {
            "text": "Si la victime se plaint de maux de tête seulement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les maux de tête ne sont pas spécifiquement liés aux lésions du rachis."
        },
        {
            "text": "Uniquement si la victime a perdu connaissance",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les lésions du rachis peuvent survenir même sans perte de connaissance."
        },
        {
            "text": "Si la victime présente une altération de la conscience",
            "isCorrect": true,
            "comment": "Réponse correcte : Une altération de la conscience peut indiquer une lésion du rachis et nécessite une évaluation médicale appropriée."
        },
        {
            "text": "Seulement si la victime est un enfant",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les lésions du rachis peuvent survenir chez des personnes de tout âge, pas seulement chez les enfants."
        }
    ]
},
{
    "text": "Quels sont les antécédents à risque de lésion du rachis ?",
    "answers": [
        {
            "text": "Une chirurgie de la colonne vertébrale",
            "isCorrect": true,
            "comment": "Réponse correcte : Une chirurgie de la colonne vertébrale peut être un antécédent à risque de lésion du rachis."
        },
        {
            "text": "Une fracture du bras dans l'enfance",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une fracture du bras n'est généralement pas un antécédent à risque de lésion du rachis."
        },
        {
            "text": "Une lésion musculaire mineure",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les lésions musculaires mineures ne sont généralement pas associées à un risque accru de lésion du rachis."
        },
        {
            "text": "Aucun antécédent médical",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Certains antécédents médicaux peuvent augmenter le risque de lésion du rachis, comme une chirurgie de la colonne vertébrale."
        }
    ]
},
{
    "text": "Quelles sont les premières actions de secours à entreprendre ?",
    "answers": [
        {
            "text": "Immobiliser la victime en lui demandant de marcher",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Demander à la victime de marcher peut aggraver les lésions du rachis."
        },
        {
            "text": "Stabiliser, restreindre les mouvements puis immobiliser la tête, le cou et le tronc de la victime",
            "isCorrect": true,
            "comment": "Réponse correcte : Les premières actions de secours consistent à stabiliser la victime et à immobiliser le rachis pour prévenir d'autres dommages."
        },
        {
            "text": "Demander à la victime de se lever et de bouger",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Demander à la victime de bouger peut aggraver les lésions du rachis."
        },
        {
            "text": "Appliquer une crème apaisante sur la zone blessée",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'application de crème ne constitue pas une mesure de secours appropriée pour les lésions du rachis."
        }
    ]
},
{
    "text": "Que signifie la stabilisation du rachis ?",
    "answers": [
        {
            "text": "Une manipulation brusque de la colonne vertébrale",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La stabilisation du rachis implique de limiter les mouvements pour éviter d'aggraver les lésions."
        },
        {
            "text": "Une immobilisation des membres supérieurs",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La stabilisation du rachis concerne principalement l'immobilisation de la colonne vertébrale, pas des membres supérieurs."
        },
        {
            "text": "Un maintien de la colonne vertébrale en position neutre",
            "isCorrect": true,
            "comment": "Réponse correcte : La stabilisation du rachis implique de maintenir la colonne vertébrale dans une position neutre pour éviter de provoquer des dommages supplémentaires."
        },
        {
            "text": "Un étirement des muscles du dos",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La stabilisation du rachis ne consiste pas à étirer les muscles du dos, mais à limiter les mouvements de la colonne vertébrale."
        }
    ]
},
{
    "text": "Comment traiter une victime agitée non coopérante ?",
    "answers": [
        {
            "text": "Lui demander de se calmer et d'écouter les instructions",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Demander à une victime agitée de se calmer peut ne pas être efficace et peut aggraver la situation."
        },
        {
            "text": "Ne pas l'immobiliser et la laisser dans la position qui lui est la plus confortable",
            "isCorrect": true,
            "comment": "Réponse correcte : Dans certains cas, laisser une victime agitée dans une position confortable et ne pas l'immobiliser peut être la meilleure option pour éviter d'aggraver son agitation."
        },
        {
            "text": "Lui administrer un sédatif sans son consentement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Administrer un sédatif sans le consentement de la victime peut être dangereux et inapproprié."
        },
        {
            "text": "Appeler la police pour la maîtriser",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Appeler la police n'est généralement pas nécessaire pour gérer une victime agitée non coopérante dans un contexte médical d'urgence."
        }
    ]
},
{
    "text": "Quels sont les moyens d'immobilisation de la colonne vertébrale ?",
    "answers": [
        {
            "text": "Seulement l'utilisation de colliers cervicaux",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les colliers cervicaux ne sont qu'une partie des moyens d'immobilisation de la colonne vertébrale."
        },
        {
            "text": "La combinaison de moyens tels que les blocs de tête, le collier cervical, le plan dur et le matelas immobilisateur à dépression",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Ces méthodes peuvent être utilisées, mais elles ne sont pas les seules moyens d'immobilisation de la colonne vertébrale."
        },
        {
            "text": "Le maintien des membres supérieurs et inférieurs avec des bandages",
            "isCorrect": true,
            "comment": "Réponse correcte : Le maintien des membres supérieurs et inférieurs avec des bandages peut aider à stabiliser la colonne vertébrale en cas de traumatisme."
        }
    ]
},
{
    "text": "Quel est le but de l'action de secours ?",
    "answers": [
        {
            "text": "De faire bouger la victime pour soulager la douleur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'action de secours vise à stabiliser la situation et à éviter d'aggraver les blessures."
        },
        {
            "text": "De ne pas aggraver une lésion instable de la colonne vertébrale et d'éviter toute immobilisation excessive",
            "isCorrect": true,
            "comment": "Réponse correcte : L'action de secours doit être effectuée avec précaution pour éviter d'aggraver les blessures existantes, en particulier les lésions de la colonne vertébrale."
        },
        {
            "text": "De transporter rapidement la victime à l'hôpital sans autre intervention",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le transport à l'hôpital est une partie de l'action de secours, mais ce n'est pas son seul objectif."
        },
        {
            "text": "D'effectuer des manipulations brutales pour \"remettre en place\" la colonne vertébrale",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les manipulations brutales peuvent aggraver les lésions de la colonne vertébrale et ne sont pas recommandées."
        }
    ]
},
{
    "text": "Que signifie la restriction des mouvements du rachis cervical ?",
    "answers": [
        {
            "text": "Une immobilisation totale du rachis cervical",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La restriction des mouvements du rachis cervical implique une limitation, pas une immobilisation totale."
        },
        {
            "text": "La limitation ou la réduction des mouvements du rachis cervical en utilisant un dispositif cervical",
            "isCorrect": true,
            "comment": "Réponse correcte : La restriction des mouvements du rachis cervical consiste à limiter les mouvements en utilisant un dispositif cervical, comme un collier cervical."
        },
        {
            "text": "L'encouragement des mouvements du rachis cervical pour éviter la raideur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La restriction des mouvements vise à éviter les mouvements excessifs qui pourraient aggraver les blessures du rachis cervical."
        },
        {
            "text": "L'utilisation d'exercices de renforcement musculaire pour le rachis cervical",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les exercices de renforcement musculaire ne sont pas utilisés pour restreindre les mouvements du rachis cervical, mais plutôt pour renforcer les muscles autour de la colonne vertébrale."
        }
    ]
},
{
    "text": "Quelles sont les étapes de l'examen de la victime en cas de traumatisme du rachis ?",
    "answers": [
        {
            "text": "Demander à la victime de marcher pour évaluer sa mobilité",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Demander à la victime de marcher peut aggraver les blessures au rachis."
        },
        {
            "text": "Limiter les mouvements du rachis à chaque étape de l'examen",
            "isCorrect": true,
            "comment": "Réponse correcte : Limiter les mouvements du rachis est crucial pour éviter d'aggraver les lésions existantes lors de l'examen."
        },
        {
            "text": "Ignorer les plaintes de la victime pour se concentrer sur l'examen",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Les plaintes de la victime doivent être prises en compte lors de l'examen pour évaluer adéquatement les blessures."
        },
        {
            "text": "Examiner uniquement les parties du corps qui semblent blessées",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'examen doit être complet pour identifier toutes les éventuelles blessures, même si elles ne semblent pas évidentes au premier abord."
        }
    ]
},
{
    "text": "Quand utiliser un collier cervical rigide ?",
    "answers": [
        {
            "text": "Uniquement lors de la marche de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le collier cervical rigide peut être nécessaire dans diverses situations, pas seulement pendant la marche de la victime."
        },
        {
            "text": "Lorsqu'il existe une déformation préexistante de la colonne vertébrale",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le collier cervical rigide est généralement utilisé pour stabiliser la colonne vertébrale après un traumatisme, pas pour corriger une déformation préexistante."
        },
        {
            "text": "Lorsqu'il est difficile de maintenir la tête dans l'axe neutre de la colonne vertébrale",
            "isCorrect": true,
            "comment": "Réponse correcte : Le collier cervical rigide est utilisé lorsqu'il est difficile de maintenir la tête dans l'axe neutre de la colonne vertébrale, surtout après un traumatisme, pour prévenir d'autres dommages à la colonne."
        },
        {
            "text": "Uniquement lors des déplacements de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le collier cervical rigide peut être utilisé même lorsque la victime est immobile pour stabiliser la colonne vertébrale."
        }
    ]
},
{
    "text": "Quel est le but de l'immobilisation de la tête et du cou ?",
    "answers": [
        {
            "text": "De permettre à la victime de bouger la tête pour se sentir plus à l'aise",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'immobilisation de la tête et du cou est nécessaire pour éviter tout mouvement pouvant aggraver les lésions existantes."
        },
        {
            "text": "De prévenir tout mouvement du rachis cervical pouvant aggraver une lésion existante",
            "isCorrect": true,
            "comment": "Réponse correcte : Le but principal de l'immobilisation de la tête et du cou est de prévenir tout mouvement du rachis cervical, ce qui pourrait aggraver une lésion existante."
        },
        {
            "text": "D'encourager la victime à se redresser rapidement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'immobilisation de la tête et du cou vise à maintenir la stabilité et ne pas encourager les mouvements brusques."
        },
        {
            "text": "De maintenir la tête en position inclinée pour améliorer la respiration",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'immobilisation de la tête et du cou ne vise pas à maintenir une position inclinée pour améliorer la respiration, mais plutôt à prévenir les mouvements qui pourraient aggraver les lésions du rachis cervical."
        }
    ]
},
{
    "text": "Comment maintenir la tête et le cou dans l'axe neutre en position latérale de sécurité ?",
    "answers": [
        {
            "text": "En laissant la tête pendre librement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. En position latérale de sécurité, il est important de maintenir la tête et le cou dans une position stable et alignée avec la colonne vertébrale."
        },
        {
            "text": "En maintenant la tête et le cou dans une position droite et alignée avec la colonne vertébrale",
            "isCorrect": true,
            "comment": "Réponse correcte : Pour maintenir la tête et le cou dans l'axe neutre en position latérale de sécurité, il faut les maintenir dans une position droite et alignée avec la colonne vertébrale."
        },
        {
            "text": "En tournant la tête vers le côté de la victime pour plus de confort",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Tourner la tête peut entraîner des problèmes respiratoires et n'est pas recommandé en position latérale de sécurité."
        },
        {
            "text": "En plaçant un oreiller sous la tête pour éviter toute flexion du cou",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. En position latérale de sécurité, l'utilisation d'un oreiller sous la tête n'est pas recommandée, car cela peut compromettre les voies respiratoires."
        }
    ]
},
{
    "text": "Que signifie la conduite à tenir 'Placer la victime en position latérale de sécurité' ?",
    "answers": [
        {
            "text": "Placer la victime dans une position confortable sans considération pour sa sécurité",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La position latérale de sécurité vise à assurer la sécurité de la victime en maintenant ses voies respiratoires dégagées."
        },
        {
            "text": "Placer la victime sur le côté, en maintenant sa tête et son cou dans l'axe neutre, pour dégager ses voies respiratoires",
            "isCorrect": true,
            "comment": "Réponse correcte : La conduite à tenir 'Placer la victime en position latérale de sécurité' consiste à placer la victime sur le côté, en maintenant sa tête et son cou dans l'axe neutre, pour dégager ses voies respiratoires."
        },
        {
            "text": "Placer la victime sur le ventre pour faciliter sa respiration",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Placer la victime sur le ventre peut aggraver sa situation en compromettant ses voies respiratoires."
        },
        {
            "text": "Placer la victime sur le dos pour faciliter l'évaluation des blessures",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Placer la victime sur le dos peut entraîner des problèmes respiratoires, donc la position latérale de sécurité est préférée pour maintenir les voies respiratoires dégagées."
        }
    ]
},
{
    "text": "Quand effectuer un relevage de sécurité ?",
    "answers": [
        {
            "text": "Lorsqu'il est difficile de maintenir la victime en position latérale de sécurité",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le relevage de sécurité est effectué dans des situations où il est nécessaire de protéger la victime et son entourage dans un environnement dangereux."
        },
        {
            "text": "Uniquement en cas de suspicion de fracture du bras",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le relevage de sécurité n'est pas spécifiquement lié à une suspicion de fracture du bras, mais plutôt à des considérations de sécurité."
        },
        {
            "text": "Lorsqu'il est nécessaire de protéger la victime et son entourage dans un environnement dangereux",
            "isCorrect": true,
            "comment": "Réponse correcte : Le relevage de sécurité est effectué lorsque c'est nécessaire pour protéger la victime et son entourage dans un environnement dangereux."
        },
        {
            "text": "Jamais, car cela pourrait aggraver les blessures de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Le relevage de sécurité est parfois nécessaire pour assurer la sécurité de la victime et de ceux qui l'entourent."
        }
    ]
},
{
    "text": "Quelle est la position de la victime lors de l'immobilisation sur un brancard cuillère ?",
    "answers": [
        {
            text: "Allongée sur le dos",
            isCorrect: true,
            comment: "Réponse correcte : La victime est allongée sur le dos lors de l'immobilisation sur un brancard cuillère pour assurer une immobilisation efficace de la colonne vertébrale."
        },
        {
            text: "Assise",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. La position allongée sur le dos est préférée pour l'immobilisation sur un brancard cuillère afin de limiter les mouvements de la colonne vertébrale."
        },
        {
            text: "Allongée sur le ventre",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. La position allongée sur le dos est généralement utilisée pour l'immobilisation sur un brancard cuillère pour assurer une meilleure stabilité de la colonne vertébrale."
        },
        {
            text: "Allongée sur le côté",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. La position allongée sur le dos est préférée lors de l'immobilisation sur un brancard cuillère pour limiter les mouvements de la colonne vertébrale."
        }
    ]
},
{
    "text": "Quelles actions doivent être prises si une victime présente une déformation préexistante de la colonne vertébrale ou est très âgée ?",
    "answers": [
        {
            text: "Immobiliser immédiatement sur un plan dur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Il est important de respecter la position de la victime et de l'immobiliser de manière confortable pour éviter d'aggraver ses blessures."
        },
        {
            text: "Ignorer la déformation pour éviter toute aggravation",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Toute déformation préexistante doit être prise en compte lors de l'immobilisation pour assurer la sécurité de la victime."
        },
        {
            text: "Respecter la position et l'immobiliser de manière confortable",
            isCorrect: true,
            comment: "Réponse correcte : En présence d'une déformation préexistante de la colonne vertébrale ou chez une victime très âgée, il est essentiel de respecter sa position et de l'immobiliser de manière confortable pour éviter d'aggraver ses blessures."
        },
        {
            text: "Éviter l'immobilisation pour ne pas aggraver la douleur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. L'immobilisation est souvent nécessaire pour prévenir les lésions supplémentaires, même si elle doit être effectuée avec précaution."
        }
    ]
},
{
    "text": "Quel est l'âge à partir duquel une victime est considérée comme âgée lors de la prise en charge d'un traumatisme du rachis ?",
    "answers": [
        {
            text: "50 ans",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le seuil d'âge à partir duquel une victime est considérée comme âgée lors de la prise en charge d'un traumatisme du rachis est généralement fixé à 65 ans."
        },
        {
            text: "60 ans",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le seuil d'âge à partir duquel une victime est considérée comme âgée lors de la prise en charge d'un traumatisme du rachis est généralement fixé à 65 ans."
        },
        {
            text: "65 ans",
            isCorrect: true,
            comment: "Réponse correcte : À partir de 65 ans, une victime est généralement considérée comme âgée lors de la prise en charge d'un traumatisme du rachis, en raison de la fragilité accrue des structures anatomiques."
        },
        {
            text: "70 ans",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le seuil d'âge à partir duquel une victime est considérée comme âgée lors de la prise en charge d'un traumatisme du rachis est généralement fixé à 65 ans."
        }
    ]
},
{
    "text": "Quel est le moyen le plus approprié pour immobiliser une victime très âgée ou présentant une déformation préexistante de la colonne vertébrale ?",
    "answers": [
        {
            text: "Collier cervical rigide",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Pour une victime très âgée ou présentant une déformation préexistante de la colonne vertébrale, le matelas immobilisateur à dépression est souvent plus approprié."
        },
        {
            text: "Matelas immobilisateur à dépression",
            isCorrect: true,
            comment: "Réponse correcte : Le matelas immobilisateur à dépression est le moyen le plus approprié pour immobiliser une victime très âgée ou présentant une déformation préexistante de la colonne vertébrale, car il offre un soutien doux et adapté."
        },
        {
            text: "Plan dur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Un plan dur peut ne pas offrir le niveau de confort nécessaire pour une victime très âgée ou avec une déformation préexistante de la colonne vertébrale."
        },
        {
            text: "Brancard cuillère",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Bien que le brancard cuillère soit utile dans certaines situations, il peut ne pas être le choix le plus adapté pour une immobilisation spécifique de la colonne vertébrale dans ces cas."
        }
    ]
},
{
    "text": "Comment immobiliser une victime qui se trouve dans un endroit difficile d'accès ?",
    "answers": [
        {
            text: "En utilisant uniquement des techniques d'extraction",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Dans un endroit difficile d'accès, il est souvent nécessaire d'utiliser des moyens dédiés tels que le plan dur ou l'attelle cervico-thoracique pour immobiliser la victime de manière sécurisée."
        },
        {
            text: "En immobilisant uniquement la partie du corps affectée",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Dans de telles situations, il est essentiel d'immobiliser l'ensemble de la victime pour éviter d'aggraver les blessures."
        },
        {
            text: "En utilisant un plan dur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Bien qu'un plan dur puisse être utile, il peut ne pas suffire dans un endroit difficile d'accès où des moyens dédiés comme le plan dur ou l'attelle cervico-thoracique peuvent être nécessaires."
        },
        {
            text: "En appliquant des moyens dédiés comme le plan dur ou l'attelle cervico-thoracique",
            isCorrect: true,
            comment: "Réponse correcte : Dans un endroit difficile d'accès, il est souvent nécessaire d'utiliser des moyens dédiés tels que le plan dur ou l'attelle cervico-thoracique pour immobiliser la victime de manière sécurisée."
        }
    ]
},
{
    "text": "Quand doit-on appliquer un collier cervical rigide ?",
    "answers": [
        {
            text: "Uniquement en cas de déformation préexistante du rachis cervical",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le collier cervical rigide est utilisé lorsque la restriction des mouvements du rachis cervical est nécessaire, par exemple en cas de traumatisme."
        },
        {
            text: "Lorsqu'il est difficile de maintenir la tête en position neutre",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le collier cervical rigide est utilisé pour restreindre les mouvements du rachis cervical lorsqu'il est nécessaire de maintenir une stabilité."
        },
        {
            text: "Si la victime se plaint de douleurs au cou",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les plaintes de douleur ne sont pas toujours le seul critère pour l'application d'un collier cervical rigide. Il est plutôt utilisé dans des situations spécifiques de traumatisme."
        },
        {
            text: "Lorsqu'il est nécessaire de restreindre les mouvements du rachis cervical",
            isCorrect: true,
            comment: "Réponse correcte : Le collier cervical rigide est appliqué lorsqu'il est nécessaire de restreindre les mouvements du rachis cervical, par exemple en cas de suspicion de lésion de la colonne vertébrale."
        }
    ]
},
{
    "text": "Quelle est la première étape à effectuer en cas de suspicion de lésion du rachis chez une victime ?",
    "answers": [
        {
            text: "Demander à la victime de se relever",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. En cas de suspicion de lésion du rachis, la première étape est d'immobiliser la tête et le cou de la victime pour éviter tout mouvement qui pourrait aggraver les blessures."
        },
        {
            text: "Immobiliser la tête et le cou de la victime",
            isCorrect: true,
            comment: "Réponse correcte : La première étape en cas de suspicion de lésion du rachis chez une victime est d'immobiliser la tête et le cou pour prévenir tout mouvement susceptible d'aggraver les blessures."
        },
        {
            text: "Demander à la victime de bouger pour évaluer les douleurs",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Demander à la victime de bouger peut aggraver une éventuelle lésion du rachis. L'immobilisation est une priorité dans de telles situations."
        },
        {
            text: "Administrer des médicaments antidouleur à la victime",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. L'administration de médicaments antidouleur ne devrait pas être la première étape en cas de suspicion de lésion du rachis. L'immobilisation est cruciale pour éviter d'aggraver les blessures."
        }
    ]
},
{
    "text": "Quels sont les signes d'une atteinte de la moelle épinière chez une victime présentant un traumatisme du dos ?",
    "answers": [
        {
            text: "Engourdissement et douleur au niveau de la colonne vertébrale",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les signes d'une atteinte de la moelle épinière sont généralement des pertes de sensibilité et de force musculaire dans les membres, pas nécessairement des engourdissements et des douleurs dans la colonne vertébrale."
        },
        {
            text: "Perte de conscience et difficulté respiratoire",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Ces symptômes peuvent être associés à d'autres types de blessures, mais pas spécifiquement à une atteinte de la moelle épinière."
        },
        {
            text: "Perte ou diminution de la force musculaire et de la sensibilité des membres",
            isCorrect: true,
            comment: "Réponse correcte : Une atteinte de la moelle épinière suite à un traumatisme du dos peut se manifester par une perte ou une diminution de la force musculaire et de la sensibilité dans les membres."
        },
        {
            text: "Douleur et raideur au niveau de la nuque",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Ces symptômes sont plus associés à des lésions cervicales que à une atteinte de la moelle épinière."
        }
    ]
},
{
    "text": "Quel est l'objectif principal de l'immobilisation d'une victime présentant un traumatisme crânien ?",
    "answers": [
        {
            text: "Réduire la douleur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Bien que la réduction de la douleur soit importante, l'objectif principal de l'immobilisation dans le cas d'un traumatisme crânien est de prévenir toute aggravation des lésions."
        },
        {
            text: "Limiter les saignements",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. L'immobilisation n'est pas directement liée à la limitation des saignements. Son objectif principal est de maintenir la stabilité et de prévenir toute exacerbation des lésions."
        },
        {
            text: "Prévenir une aggravation des lésions",
            isCorrect: true,
            comment: "Réponse correcte : L'objectif principal de l'immobilisation d'une victime présentant un traumatisme crânien est de prévenir toute aggravation des lésions, en maintenant la stabilité de la tête et du cou."
        },
        {
            text: "Faciliter le transport de la victime",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Bien que le transport soit important, l'objectif principal de l'immobilisation dans le cas d'un traumatisme crânien est de prévenir toute exacerbation des lésions."
        }
    ]
},
{
    "text": "Quelles sont les causes d'une atteinte du thorax ?",
    "answers": [
        {
            text: "Un excès d'exercice",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les causes d'une atteinte du thorax sont généralement liées à des traumatismes physiques, pas à un excès d'exercice."
        },
        {
            text: "Une mauvaise alimentation",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les causes d'une atteinte du thorax sont généralement liées à des traumatismes physiques, pas à une mauvaise alimentation."
        },
        {
            text: "Un choc direct au niveau des côtes",
            isCorrect: true,
            comment: "Réponse correcte : Les traumatismes du thorax sont souvent causés par un choc direct au niveau des côtes."
        },
        {
            text: "Une exposition prolongée au soleil",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les causes d'une atteinte du thorax sont généralement liées à des traumatismes physiques, pas à une exposition prolongée au soleil."
        }
    ]
},
{
    "text": "Quels sont les risques associés à une atteinte traumatique du thorax ?",
    "answers": [
        {
            text: "Une blessure à la jambe",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les risques associés à une atteinte traumatique du thorax sont principalement liés à la fonction respiratoire."
        },
        {
            text: "Une détresse respiratoire",
            isCorrect: true,
            comment: "Réponse correcte : Une atteinte traumatique du thorax peut entraîner une détresse respiratoire en raison de l'impact sur les poumons et la cage thoracique."
        },
        {
            text: "Une diminution de l'appétit",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les risques associés à une atteinte traumatique du thorax sont principalement liés à la fonction respiratoire, pas à l'appétit."
        },
        {
            text: "Une augmentation de la tension artérielle",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les risques associés à une atteinte traumatique du thorax sont principalement liés à la fonction respiratoire, pas à la tension artérielle."
        }
    ]
},
{
    "text": "Quels sont les signes d'une atteinte du thorax ?",
    "answers": [
        {
            text: "Une perte de cheveux",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les signes d'une atteinte du thorax ne sont pas associés à une perte de cheveux."
        },
        {
            text: "Une perte de poids",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les signes d'une atteinte du thorax ne sont pas associés à une perte de poids."
        },
        {
            text: "Une douleur au niveau des côtes",
            isCorrect: true,
            comment: "Réponse correcte : La douleur au niveau des côtes est un signe fréquent d'atteinte du thorax, souvent associée à un traumatisme."
        },
        {
            text: "Une augmentation de la température corporelle",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les signes d'une atteinte du thorax ne sont pas généralement associés à une augmentation de la température corporelle."
        }
    ]
},
{
    "text": "Comment peut se manifester une atteinte du thorax chez une victime consciente ?",
    "answers": [
        {
            text: "Par des démangeaisons",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les atteintes du thorax ne se manifestent généralement pas par des démangeaisons."
        },
        {
            text: "Par des crampes musculaires",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les atteintes du thorax ne se manifestent généralement pas par des crampes musculaires."
        },
        {
            text: "Par une douleur spontanée au niveau des côtes",
            isCorrect: true,
            comment: "Réponse correcte : Une douleur spontanée au niveau des côtes est souvent un signe d'atteinte du thorax chez une victime consciente."
        },
        {
            text: "Par une diminution de l'odorat",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les atteintes du thorax ne sont pas généralement associées à une diminution de l'odorat."
        }
    ]
},
{
    "text": "Que peut trouver un secouriste à l'examen d'une victime avec un traumatisme du thorax ?",
    "answers": [
        {
            text: "Une perte de vision",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les atteintes du thorax ne sont pas généralement associées à une perte de vision."
        },
        {
            text: "Une perte auditive",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les atteintes du thorax ne sont pas généralement associées à une perte auditive."
        },
        {
            text: "Une douleur à la palpation prudente des côtes",
            isCorrect: true,
            comment: "Réponse correcte : Lors de l'examen d'une victime avec un traumatisme du thorax, un secouriste peut trouver une douleur à la palpation prudente des côtes."
        },
        {
            text: "Une diminution de la sensibilité au toucher",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les atteintes du thorax ne sont pas généralement associées à une diminution de la sensibilité au toucher."
        }
    ]
},
{
    "text": "Quelle action de secours est recommandée en cas de plaie thoracique ?",
    "answers": [
        {
            "text": "Appliquer de la chaleur sur la plaie",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Appliquer de la chaleur peut aggraver la situation en cas de plaie thoracique."
        },
        {
            "text": "Mettre un bandage serré autour de la plaie",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un bandage serré peut comprimer la plaie et entraîner des complications."
        },
        {
            "text": "Protéger la plaie par un dispositif médical non occlusif spécifique",
            "isCorrect": true,
            "comment": "Réponse correcte : Il est recommandé de protéger la plaie thoracique avec un dispositif médical non occlusif spécifique pour éviter l'entrée d'air dans la cavité thoracique."
        },
        {
            "text": "Rincer la plaie avec de l'eau de Javel",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Rincer la plaie avec de l'eau de Javel peut causer des dommages supplémentaires."
        }
    ]
},
{
    "text": "Que faut-il faire si une victime a perdu connaissance suite à un traumatisme du thorax ?",
    "answers": [
        {
            "text": "Laisser la victime sans assistance",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Il est crucial de fournir une assistance à une victime inconsciente, surtout après un traumatisme du thorax."
        },
        {
            "text": "Appliquer une RCP immédiatement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La RCP est nécessaire seulement si la victime cesse de respirer ou si son pouls s'arrête."
        },
        {
            "text": "Attendre que la victime reprenne connaissance",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Si une victime est inconsciente, il faut agir rapidement pour obtenir de l'aide médicale."
        },
        {
            "text": "Appeler les secours",
            "isCorrect": true,
            "comment": "Réponse correcte : L'appel aux secours est la première étape essentielle à effectuer si une victime perd connaissance après un traumatisme du thorax."
        }
    ]
},
{
    "text": "Quelle est la première étape à effectuer en cas de suspicion de lésion du rachis chez une victime ?",
    "answers": [
        {
            "text": "Demander à la victime de se relever",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Il est déconseillé de demander à une victime de se relever en cas de suspicion de lésion du rachis."
        },
        {
            "text": "Immobiliser la tête et le cou de la victime",
            "isCorrect": true,
            "comment": "Réponse correcte : L'immobilisation de la tête et du cou est la première étape cruciale en cas de suspicion de lésion du rachis chez une victime."
        },
        {
            "text": "Demander à la victime de bouger pour évaluer les douleurs",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Il est déconseillé de faire bouger une victime en cas de suspicion de lésion du rachis."
        },
        {
            "text": "Administrer des médicaments antidouleur à la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Administrer des médicaments sans évaluation médicale peut aggraver la situation."
        }
    ]
},
{
"text": "Comment peut se manifester une atteinte du thorax chez une victime consciente ?",
"answers": [
    {
        "text": "Par des démangeaisons",
        "isCorrect": false
    },
    {
        "text": "Par des crampes musculaires",
        "isCorrect": false
    },
    {
        "text": "Par une douleur spontanée au niveau des côtes",
        "isCorrect": true,
        "comment": "Réponse correcte : Une douleur spontanée au niveau des côtes peut indiquer une atteinte du thorax chez une victime consciente."
    },
    {
        "text": "Par une diminution de l'odorat",
        "isCorrect": false
    }
]
},
{
"text": "Que doit-on faire en premier en cas de suspicion de lésion du rachis chez une victime ?",
"answers": [
    {
        "text": "Demander à la victime de se relever",
        "isCorrect": false
    },
    {
        "text": "Immobiliser la tête et le cou de la victime",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de suspicion de lésion du rachis, il est crucial d'immobiliser la tête et le cou de la victime pour prévenir d'autres dommages."
    },
    {
        "text": "Demander à la victime de bouger pour évaluer les douleurs",
        "isCorrect": false
    },
    {
        "text": "Administrer des médicaments antidouleur à la victime",
        "isCorrect": false
    }
]
},
{
"text": "Quelle est la première étape à effectuer en cas de suspicion de lésion du rachis chez une victime ?",
"answers": [
    {
        "text": "Demander à la victime de se relever",
        "isCorrect": false
    },
    {
        "text": "Immobiliser la tête et le cou de la victime",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de suspicion de lésion du rachis, la première étape est d'immobiliser la tête et le cou de la victime pour éviter tout mouvement qui pourrait aggraver la blessure."
    },
    {
        "text": "Demander à la victime de bouger pour évaluer les douleurs",
        "isCorrect": false
    },
    {
        "text": "Administrer des médicaments antidouleur à la victime",
        "isCorrect": false
    }
]
},
{
"text": "Qu'est-ce qu'une entorse ?",
"answers": [
    {
        "text": "Une fracture totale de l'os",
        "isCorrect": false
    },
    {
        "text": "Une lésion traumatique des ligaments due à un mouvement forcé",
        "isCorrect": true,
        "comment": "Réponse correcte : Une entorse est une lésion des ligaments due à un mouvement forcé."
    },
    {
        "text": "Une perte complète des rapports articulaires",
        "isCorrect": false
    },
    {
        "text": "Une déformation permanente des os",
        "isCorrect": false
    }
]
},
{
"text": "Qu'est-ce qu'une luxation ?",
"answers": [
    {
        "text": "Une fracture compliquée",
        "isCorrect": false
    },
    {
        "text": "Une lésion des nerfs autour de l'articulation",
        "isCorrect": false
    },
    {
        "text": "Une déformation des os sans lésion ligamentaire",
        "isCorrect": false
    },
    {
        "text": "Une perte permanente des rapports articulaires normaux",
        "isCorrect": true,
        "comment": "Réponse correcte : Une luxation entraîne une perte permanente des rapports articulaires normaux."
    }
]
},
{
"text": "Quelles sont les causes d'une atteinte des os et des articulations des membres ?",
"answers": [
    {
        "text": "Un mouvement normal sans contrainte",
        "isCorrect": false
    },
    {
        "text": "Une agression uniquement",
        "isCorrect": false
    },
    {
        "text": "Un choc direct ou indirect, ou par pénétration d'un corps étranger",
        "isCorrect": true,
        "comment": "Réponse correcte : Les atteintes des os et des articulations peuvent être causées par un choc direct ou indirect, ou par la pénétration d'un corps étranger."
    },
    {
        "text": "Une blessure par chute légère",
        "isCorrect": false
    }
]
},
{
"text": "Quelles sont les complications potentielles des lésions des os et des articulations ?",
"answers": [
    {
        "text": "Perte de mémoire",
        "isCorrect": false
    },
    {
        "text": "Atteinte des vaisseaux sanguins",
        "isCorrect": true,
        "comment": "Réponse correcte : Les complications peuvent inclure des atteintes des vaisseaux sanguins."
    },
    {
        "text": "Augmentation de la pression artérielle",
        "isCorrect": false
    },
    {
        "text": "Détérioration de la vue",
        "isCorrect": false
    }
]
},
{
"text": "Quels sont les signes d'un traumatisme des membres ou des articulations ?",
"answers": [
    {
        "text": "Perte de conscience",
        "isCorrect": false
    },
    {
        "text": "Douleur vive et difficulté à bouger le membre",
        "isCorrect": true,
        "comment": "Réponse correcte : Les signes incluent une douleur vive et une difficulté à bouger le membre."
    },
    {
        "text": "Évanouissement",
        "isCorrect": false
    },
    {
        "text": "Sensation de chaleur au niveau de la lésion",
        "isCorrect": false
    }
]
},
{
"text": "Que doit faire le secouriste pour limiter les mouvements du membre blessé ?",
"answers": [
    {
        "text": "Masser doucement la zone blessée",
        "isCorrect": false
    },
    {
        "text": "Appliquer des compresses chaudes",
        "isCorrect": false
    },
    {
        "text": "Limiter autant que possible les mouvements du membre blessé",
        "isCorrect": true,
        "comment": "Réponse correcte : Il est essentiel de limiter les mouvements du membre blessé pour éviter d'aggraver la blessure."
    },
    {
        "text": "Placer la victime en position debout",
        "isCorrect": false
    }
]
},
{
"text": "Quelle est la conduite à tenir si la victime présente une fracture ouverte ?",
"answers": [
    {
        "text": "Masser la zone pour améliorer la circulation sanguine",
        "isCorrect": false
    },
    {
        "text": "Appliquer du froid sur la plaie",
        "isCorrect": false
    },
    {
        "text": "Recouvrir la plaie d'un pansement stérile avant l'immobilisation",
        "isCorrect": true,
        "comment": "Réponse correcte : Il est crucial de recouvrir la plaie d'un pansement stérile avant l'immobilisation."
    },
    {
        "text": "Détecter et retirer les corps étrangers de la plaie",
        "isCorrect": false
    }
]
},
{
"text": "Pourquoi doit-on immobiliser le membre atteint avec l'attelle la plus appropriée ?",
"answers": [
    {
        "text": "Pour aggraver la lésion",
        "isCorrect": false
    },
    {
        "text": "Pour réduire la douleur",
        "isCorrect": false
    },
    {
        "text": "Pour empêcher tout déplacement de la zone blessée",
        "isCorrect": true,
        "comment": "Réponse correcte : L'immobilisation est essentielle pour empêcher tout déplacement de la zone blessée."
    },
    {
        "text": "Pour permettre à la victime de bouger librement",
        "isCorrect": false
    }
]
},
{
"text": "Quelle est l'utilité de l'application de froid sur une lésion ?",
"answers": [
    {
        "text": "Pour augmenter le gonflement",
        "isCorrect": false
    },
    {
        "text": "Pour réduire la douleur",
        "isCorrect": true,
        "comment": "Réponse correcte : L'application de froid sur une lésion aide à réduire la douleur."
    },
    {
        "text": "Pour provoquer une fracture",
        "isCorrect": false
    },
    {
        "text": "Pour stimuler la circulation sanguine",
        "isCorrect": false
    }
]
},
{
"text": "Que faire si la victime présente une fracture ouverte avec un morceau d'os visible ?",
"answers": [
    {
        "text": "Réaligner immédiatement le membre",
        "isCorrect": false
    },
    {
        "text": "Toucher le morceau d'os pour le replacer",
        "isCorrect": false
    },
    {
        "text": "Ne pas toucher au morceau d'os et recouvrir la plaie d'un pansement stérile",
        "isCorrect": true,
        "comment": "Réponse correcte : Il est important de ne pas toucher au morceau d'os visible et de recouvrir la plaie d'un pansement stérile."
    },
    {
        "text": "Appliquer de la chaleur sur la plaie",
        "isCorrect": false
    }
]
},
{
"text": "Quand est-il possible de réaliser le réalignement d'une fracture ?",
"answers": [
    {
        "text": "Uniquement si la victime le demande",
        "isCorrect": false
    },
    {
        "text": "Uniquement en cas de fracture ouverte",
        "isCorrect": false
    },
    {
        "text": "En cas de déformation importante du membre avec complication ou impossibilité d'immobilisé",
        "isCorrect": true,
        "comment": "Réponse correcte : Le réalignement est nécessaire en cas de déformation importante du membre."
    },
    {
        "text": "Jamais, car cela peut aggraver la lésion",
        "isCorrect": false
    }
]
},
{
"text": "Comment le secouriste doit-il placer la victime si l'atteinte est au niveau d'un membre supérieur ?",
"answers": [
    {
        "text": "Placer le membre atteint contre sa poitrine et le soutenir",
        "isCorrect": true,
        "comment": "Réponse correcte : Pour une atteinte au niveau d'un membre supérieur, le secouriste doit placer le membre contre la poitrine de la victime et le soutenir."
    },
    {
        "text": "Demander à la victime de lever le bras blessé",
        "isCorrect": false
    },
    {
        "text": "Masser doucement le membre blessé",
        "isCorrect": false
    },
    {
        "text": "Immobiliser le membre avec des compresses",
        "isCorrect": false
    }
]
},
{
"text": "Que doit faire le secouriste en cas de fracture ouverte avec un morceau d'os visible ?",
"answers": [
    {
        "text": "Toucher le morceau d'os pour le replacer",
        "isCorrect": false
    },
    {
        "text": "Recouvrir la plaie d'un pansement stérile avant l'immobilisation",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de fracture ouverte avec un morceau d'os visible, il est important de recouvrir la plaie d'un pansement stérile avant toute immobilisation."
    },
    {
        "text": "Réaligner immédiatement le membre",
        "isCorrect": false
    },
    {
        "text": "Appliquer une chaleur intense sur la plaie",
        "isCorrect": false
    }
]
},
    {
        "text": "Quelles sont les causes courantes des traumatismes de la face et du cou ?",
        "answers": [
            {
                "text": "Choc électrique",
                "isCorrect": false,
                "comment": "Bien que le choc électrique puisse causer des traumatismes, il est moins fréquent dans le cas des traumatismes de la face et du cou."
            },
            {
                "text": "Blessure pénétrante comme une piqûre d'insecte",
                "isCorrect": false,
                "comment": "Les blessures pénétrantes comme les piqûres d'insectes peuvent causer des traumatismes mais ne sont pas courantes spécifiquement pour la face et le cou."
            },
            {
                "text": "Choc direct ou blessure pénétrante",
                "isCorrect": true,
                "comment": "Réponse correcte : Les traumatismes de la face et du cou surviennent souvent suite à un choc direct ou une blessure pénétrante."
            },
            {
                "text": "Exposition prolongée au soleil",
                "isCorrect": false,
                "comment": "L'exposition prolongée au soleil n'est pas une cause courante de traumatismes de la face et du cou, mais peut causer d'autres types de blessures."
            }
        ]
    },
    {
        "text": "Quels signes peuvent être observés lors d'un examen de la face après un traumatisme ?",
        "answers": [
            {
                "text": "Rougeur généralisée",
                "isCorrect": false,
                "comment": "La rougeur généralisée n'est pas un signe typique observé lors d'un traumatisme facial, qui est souvent caractérisé par d'autres symptômes comme des ecchymoses."
            },
            {
                "text": "Hématome en lunette",
                "isCorrect": true,
                "comment": "Réponse correcte : Un hématome en lunette autour des yeux est un signe fréquent lors d'un traumatisme facial."
            },
            {
                "text": "Cheveux emmêlés",
                "isCorrect": false,
                "comment": "Les cheveux emmêlés ne sont généralement pas un signe direct de traumatisme facial et ne sont pas spécifiques à cette condition."
            },
            {
                "text": "Éternuements fréquents",
                "isCorrect": false,
                "comment": "Les éternuements fréquents ne sont pas un signe typique observé lors d'un traumatisme facial et ne sont pas liés directement à cette condition."
            }
        ]
    },
    {
        "text": "Que doit faire le secouriste en cas de plaie grave au niveau de la face ou du cou ?",
        "answers": [
            {
                "text": "Ignorer la plaie tant que les signes vitaux sont stables",
                "isCorrect": false,
                "comment": "Ignorer une plaie grave peut aggraver la situation. Il est essentiel d'intervenir pour arrêter le saignement et protéger la victime."
            },
            {
                "text": "Arrêter le saignement par compression manuelle",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de plaie grave, il est essentiel d'arrêter le saignement par compression manuelle pour éviter une perte de sang excessive."
            },
            {
                "text": "Appliquer de la chaleur sur la plaie",
                "isCorrect": false,
                "comment": "L'application de chaleur n'est pas recommandée pour les plaies graves, car cela peut aggraver les dommages et le saignement."
            },
            {
                "text": "Examiner l'œil de près pour détecter des corps étrangers",
                "isCorrect": false,
                "comment": "L'examen de l'œil n'est pas nécessaire pour une plaie au niveau de la face ou du cou, sauf s'il y a des symptômes spécifiques."
            }
        ]
    },
    {
        "text": "Comment traiter une atteinte traumatique de l'œil en situation d'urgence ?",
        "answers": [
            {
                "text": "Demander à la victime de bouger les yeux pour tester la vision",
                "isCorrect": false,
                "comment": "Demander à la victime de bouger les yeux peut aggraver les blessures oculaires. Il est préférable de maintenir les yeux immobiles et de les couvrir."
            },
            {
                "text": "Recouvrir les deux yeux avec des compresses stériles",
                "isCorrect": true,
                "comment": "Réponse correcte : Il est important de recouvrir les deux yeux avec des compresses stériles pour protéger les yeux et réduire les mouvements."
            },
            {
                "text": "Essayer d'enlever les corps étrangers oculaires",
                "isCorrect": false,
                "comment": "Tenter d'enlever les corps étrangers oculaires peut aggraver les blessures. Il est préférable de laisser cela aux professionnels de la santé."
            },
            {
                "text": "Appliquer une pression directe sur l'œil blessé",
                "isCorrect": false,
                "comment": "L'application de pression directe sur un œil blessé peut causer des dommages supplémentaires. Il est préférable de couvrir l'œil avec une compresse."
            }
        ]
    },
    {
        "text": "Quelle est la conduite à tenir face à un saignement abondant causé par une fracture de la face ?",
        "answers": [
            {
                "text": "Demander à la victime de se lever rapidement",
                "isCorrect": false,
                "comment": "Demander à la victime de se lever rapidement peut aggraver le saignement en augmentant la pression sanguine. Il est important de maintenir la victime allongée."
            },
            {
                "text": "Appliquer une compresse froide sur la plaie",
                "isCorrect": false,
                "comment": "Une compresse froide peut être utile pour réduire l'enflure mais n'arrête pas efficacement le saignement. Une compression manuelle est plus appropriée."
            },
            {
                "text": "Installer la victime sur le côté",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de saignement abondant, il est recommandé d'installer la victime sur le côté pour éviter l'obstruction des voies respiratoires et gérer le saignement."
            },
            {
                "text": "Installer la victime sur le dos",
                "isCorrect": false,
                "comment": "Installer la victime sur le dos peut aggraver le saignement en augmentant la pression sur la région blessée."
            }
        ]
    },
    {
        "text": "Comment doit être traitée une plaie de la face ou du cou en cas de saignement abondant ?",
        "answers": [
            {
                "text": "Utiliser un tourniquet",
                "isCorrect": false,
                "comment": "L'utilisation d'un tourniquet n'est pas recommandée pour les plaies de la face ou du cou, car cela peut aggraver les blessures et causer des complications."
            },
            {
                "text": "Effectuer une compression manuelle",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de saignement abondant, il est essentiel d'effectuer une compression manuelle pour contrôler le saignement et stabiliser la victime."
            },
            {
                "text": "Appliquer de la chaleur",
                "isCorrect": false,
                "comment": "L'application de chaleur peut aggraver le saignement en dilatant les vaisseaux sanguins. Une compression froide peut être plus bénéfique."
            },
            {
                "text": "Rincer abondamment à l'eau",
                "isCorrect": false,
                "comment": "Rincer à l'eau peut être utile pour nettoyer la plaie mais ne contrôle pas efficacement le saignement. La compression manuelle est prioritaire."
            }
        ]
    },
    {
        "text": "Pourquoi est-il important de ne pas comprimer la trachée lors de la compression manuelle pour arrêter un saignement au niveau du cou ?",
        "answers": [
            {
                "text": "Pour éviter une obstruction des voies aériennes",
                "isCorrect": true,
                "comment": "Réponse correcte : Comprimer la trachée peut entraîner une obstruction des voies aériennes, compromettant la respiration de la victime."
            },
            {
                "text": "Pour réduire la douleur de la victime",
                "isCorrect": false,
                "comment": "La compression de la trachée ne vise pas à réduire la douleur mais à contrôler le saignement et maintenir les voies respiratoires dégagées."
            },
            {
                "text": "Pour vérifier la fréquence cardiaque",
                "isCorrect": false,
                "comment": "La compression de la trachée n'est pas utilisée pour évaluer la fréquence cardiaque. D'autres méthodes sont plus appropriées pour cet objectif."
            },
            {
                "text": "Pour évaluer la température corporelle",
                "isCorrect": false,
                "comment": "La compression de la trachée n'est pas liée à l'évaluation de la température corporelle. Son but principal est de contrôler le saignement."
            }
        ]
    },
    {
        "text": "Comment doit être considérée une plaie de la face ou du cou en termes de gravité ?",
        "answers": [
            {
                "text": "Comme une blessure mineure",
                "isCorrect": false,
                "comment": "Les plaies de la face ou du cou peuvent être graves et potentiellement mettent en danger la vie de la victime. Elles doivent être traitées avec sérieux et rapidité."
            },
            {
                "text": "Comme une blessure grave",
                "isCorrect": true,
                "comment": "Réponse correcte : Les plaies de la face ou du cou sont généralement considérées comme graves en raison du risque de saignement abondant et de complications respiratoires."
            },
            {
                "text": "Comme une égratignure sans conséquence",
                "isCorrect": false,
                "comment": "Même les plaies apparemment mineures au niveau de la face ou du cou peuvent être graves et nécessiter une intervention immédiate."
            },
            {
                "text": "Comme une brûlure légère",
                "isCorrect": false,
                "comment": "Une plaie au niveau de la face ou du cou n'est pas comparable à une brûlure légère en termes de gravité. Les plaies de cette nature peuvent mettre en danger la vie."
            }
        ]
    },
    {
        "text": "Quelle est la première priorité lors de l'action de secours pour un traumatisme de la face et du cou ?",
        "answers": [
            {
                "text": "Appliquer une crème antiseptique",
                "isCorrect": false,
                "comment": "L'application d'une crème antiseptique peut être utile mais n'est pas la première priorité lors de la prise en charge d'un traumatisme grave de la face ou du cou."
            },
            {
                "text": "Demander un avis médical",
                "isCorrect": false,
                "comment": "Demander un avis médical est important mais la première priorité est de traiter toute détresse vitale immédiate pour stabiliser la victime."
            },
            {
                "text": "Lutter contre une détresse vitale",
                "isCorrect": true,
                "comment": "Réponse correcte : La première priorité lors d'un traumatisme de la face et du cou est de lutter contre toute détresse vitale afin de maintenir la stabilité de la victime."
            },
            {
                "text": "Installer la victime en position assise",
                "isCorrect": false,
                "comment": "Installer la victime en position assise peut être inapproprié si des blessures graves sont suspectées. La position allongée est souvent préférable."
            }
        ]
    },
    {
        "text": "Que faire si la victime se plaint d'une douleur de la face ou de troubles de la vision ?",
        "answers": [
            {
                "text": "Ignorer les plaintes si la respiration est normale",
                "isCorrect": false,
                "comment": "Les plaintes de douleur ou de troubles de la vision ne doivent jamais être ignorées. Elles peuvent indiquer des blessures sous-jacentes graves."
            },
            {
                "text": "Évaluer les signes vitaux uniquement",
                "isCorrect": false,
                "comment": "Évaluer les signes vitaux est important mais ne remplace pas l'évaluation des symptômes rapportés par la victime."
            },
            {
                "text": "Continuer l'examen sans prêter attention aux plaintes",
                "isCorrect": false,
                "comment": "Les plaintes de douleur ou de troubles de la vision doivent être prises au sérieux et guidées par une évaluation appropriée."
            },
            {
                "text": "Noter les plaintes et agir en conséquence",
                "isCorrect": true,
                "comment": "Réponse correcte : Il est essentiel de noter les plaintes de la victime et d'agir en conséquence en réalisant une évaluation appropriée pour traiter les symptômes."
            }
        ]
    },
    {
        "text": "Quand demander un avis médical lors d'un traumatisme de la face et du cou ?",
        "answers": [
            {
                "text": "Si la victime se plaint de douleurs mineures",
                "isCorrect": false,
                "comment": "Les douleurs mineures peuvent ne pas nécessiter d'avis médical urgent. Un avis médical est nécessaire en cas de détresse vitale ou de blessure grave."
            },
            {
                "text": "Après avoir recouvert la plaie d'un pansement stérile",
                "isCorrect": false,
                "comment": "Recouvrir la plaie d'un pansement stérile est important mais ne remplace pas la nécessité d'un avis médical en cas de détresse vitale ou de blessure grave."
            },
            {
                "text": "En cas de détresse vitale ou de blessure grave",
                "isCorrect": true,
                "comment": "Réponse correcte : Un avis médical est indispensable en cas de détresse vitale ou de blessure grave pour assurer une prise en charge médicale appropriée."
            },
            {
                "text": "Avant d'évaluer la gravité de la situation",
                "isCorrect": false,
                "comment": "Il est essentiel de demander un avis médical immédiat en cas de détresse vitale ou de blessure grave, sans attendre l'évaluation de la gravité de la situation."
            }
        ]
    },
    {
        "text": "Quand est-il recommandé de mettre en place une contention pelvienne chez une victime suspectée de traumatisme du bassin ?",
        answers: [
          { "text": "Après avis ou à la demande du médecin, ou si la victime présente des signes de détresse circulatoire et qu'un avis médical ne peut pas être obtenu.", isCorrect: true, comment: "C'est exact, la contention pelvienne est mise en place dans ces circonstances spécifiques." },
          { "text": "Uniquement si la victime demande une contention pelvienne.", isCorrect: false, comment: "La mise en place de la contention pelvienne dépend des critères médicaux et de la situation de la victime, pas uniquement de sa demande." },
          { "text": "En cas de suspicion de fracture ailleurs que dans le bassin.", isCorrect: false, comment: "La contention pelvienne est spécifique aux traumatismes du bassin." },
          { "text": "Si le secouriste juge nécessaire d'immobiliser la victime avant le transport.", isCorrect: false, comment: "La mise en place de la contention pelvienne suit des directives précises liées aux conditions médicales de la victime." }
        ]
      },
      {
        "text": "Quel est l'effet de la contention pelvienne sur les fragments osseux en cas de fracture du bassin ?",
        answers: [
          { "text": "Elle rapproche les fragments osseux de la fracture et les immobilise.", isCorrect: true, comment: "Oui, la contention pelvienne favorise l'immobilisation des fragments osseux pour réduire les complications." },
          { "text": "Elle augmente la mobilité des fragments osseux.", isCorrect: false, comment: "La contention pelvienne vise à immobiliser les fragments osseux pour éviter davantage de complications." },
          { "text": "Elle n'a aucun effet sur les fragments osseux.", isCorrect: false, comment: "La contention pelvienne a un impact direct sur l'immobilisation des fragments osseux." },
          { "text": "Elle dissocie les fragments osseux pour faciliter leur traitement médical.", isCorrect: false, comment: "La contention pelvienne a pour but de stabiliser les fragments osseux." }
        ]
      },
      {
        "text": "Quand doit-on mettre en place une contention pelvienne chez une victime suspectée de traumatisme du bassin ?",
        answers: [
          { "text": "Après avis médical ou en cas de détresse circulatoire si un avis médical n'est pas disponible.", isCorrect: true, comment: "Exact, la contention pelvienne est recommandée dans ces situations spécifiques." },
          { "text": "Uniquement si la victime demande une contention pelvienne.", isCorrect: false, comment: "La décision de mettre en place une contention pelvienne dépend des critères médicaux, pas seulement de la demande de la victime." },
          { "text": "En cas de suspicion de fracture ailleurs que dans le bassin.", isCorrect: false, comment: "La contention pelvienne est spécifique aux traumatismes du bassin." },
          { "text": "Si la victime ressent des douleurs au niveau du bassin.", isCorrect: false, comment: "La mise en place de la contention pelvienne est basée sur des critères médicaux spécifiques." }
        ]
      },
      {
        "text": "Quel est l'équipement nécessaire pour mettre en place une contention pelvienne ?",
        answers: [
          { "text": "Une ceinture pelvienne adaptée à la taille de la victime.", isCorrect: true, comment: "Oui, il est essentiel d'utiliser une ceinture pelvienne appropriée." },
          { "text": "Un drap ou autre moyen de fortune.", isCorrect: false, comment: "Les moyens de fortune ne sont pas recommandés pour la contention pelvienne." },
          { "text": "Des bandages et du ruban adhésif.", isCorrect: false, comment: "La contention pelvienne nécessite l'utilisation d'une ceinture pelvienne spécifique." },
          { "text": "Aucun équipement spécifique n'est nécessaire.", isCorrect: false, comment: "Une ceinture pelvienne adaptée est indispensable pour la contention pelvienne." }
        ]
      },
      {
        "text": "Combien de temps maximum devrait prendre la mise en place d'une contention pelvienne ?",
        answers: [
          { "text": "Entre 3 à 5 minutes.", isCorrect: true, comment: "Oui, la contention pelvienne doit être rapide pour assurer une intervention efficace." },
          { "text": "Plus de 10 minutes.", isCorrect: false, comment: "La mise en place de la contention pelvienne ne devrait pas prendre autant de temps." },
          { "text": "Moins d'une minute.", isCorrect: false, comment: "La contention pelvienne nécessite plus de temps pour être correctement mise en place." },
          { "text": "Aucune limite de temps n'est imposée.", isCorrect: false, comment: "Il est recommandé de ne pas dépasser 3 à 5 minutes pour la mise en place de la contention pelvienne." }
        ]
      },
      {
        "text": "Quel est l'objectif principal de la contention pelvienne en cas de traumatisme du bassin ?",
        answers: [
          { "text": "Immobiliser les fragments osseux et réduire les saignements internes.", isCorrect: true, comment: "Oui, la contention pelvienne vise à stabiliser le bassin et à limiter les complications." },
          { "text": "Assurer le confort de la victime pendant le transport.", isCorrect: false, comment: "La contention pelvienne a pour objectif principal d'immobiliser et de stabiliser le bassin." },
          { "text": "Empêcher toute mobilité de la victime.", isCorrect: false, comment: "La contention pelvienne est spécifique à la stabilisation du bassin, pas à l'immobilité totale de la victime." },
          { "text": "Réduire la douleur de la victime.", isCorrect: false, comment: "Bien que la contention pelvienne puisse aider à réduire la douleur, son objectif principal est la stabilisation du bassin." }
        ]
      },
      {
        "text": "Quand peut-on envisager une contention pelvienne préinstallée sous la victime ?",
        answers: [
          { "text": "En attendant un avis médical.", isCorrect: true, comment: "Oui, une contention pelvienne peut être préinstallée en attendant un avis médical." },
          { "text": "Uniquement si la victime est consciente et demande une contention pelvienne.", isCorrect: false, comment: "La mise en place de la contention pelvienne suit des protocoles médicaux spécifiques." },
          { "text": "Après avoir consulté plusieurs secouristes sur place.", isCorrect: false, comment: "La décision de mettre en place une contention pelvienne dépend des critères médicaux spécifiques à la victime." },
          { "text": "Après le diagnostic d'une fracture du bassin par un secouriste.", isCorrect: false, comment: "La contention pelvienne doit être mise en place en fonction des indications médicales appropriées." }
        ]
      },
      {
        "text": "Quels sont les risques liés à la mise en place d'une contention pelvienne pour d'autres types de fractures ?",
        answers: [
          { "text": "Aucun effet secondaire si les conditions de mise en place sont respectées.", isCorrect: true, comment: "Oui, la contention pelvienne est sans risques supplémentaires si elle est correctement mise en place." },
          { "text": "Augmentation des complications liées à la fracture.", isCorrect: false, comment: "La contention pelvienne est conçue pour stabiliser le bassin sans augmenter les complications." },
          { "text": "Réduction de la circulation sanguine vers la région lésée.", isCorrect: false, comment: "La contention pelvienne vise à stabiliser et à limiter les saignements, pas à réduire la circulation sanguine." },
          { "text": "Augmentation du risque de déplacement des fragments osseux.", isCorrect: false, comment: "La contention pelvienne est conçue pour stabiliser les fragments osseux et limiter leur déplacement." }
        ]
      },
      {
        "text": "Que doit faire un secouriste avant de mettre en place une contention pelvienne ?",
        answers: [
          { "text": "Évaluer la situation et obtenir un avis médical si possible.", isCorrect: true, comment: "Oui, il est essentiel d'évaluer la situation et de suivre les protocoles médicaux appropriés." },
          { "text": "Demander à la victime si elle souhaite une contention pelvienne.", isCorrect: false, comment: "La décision de mettre en place une contention pelvienne est basée sur des critères médicaux spécifiques." },
          { "text": "Commencer immédiatement à mettre en place la contention pelvienne.", isCorrect: false, comment: "La mise en place de la contention pelvienne doit être basée sur une évaluation médicale appropriée." },
          { "text": "Appeler plusieurs secouristes pour obtenir leur avis.", isCorrect: false, comment: "La décision de mettre en place une contention pelvienne dépend des critères médicaux et de l'évaluation de la situation." }
        ]
      },
      {
        "text": "Pour quels membres du corps peut-on utiliser une attelle à dépression ?",
        answers: [
          { "text": "Le coude, l'avant-bras, le poignet, le genou, la jambe, la cheville et parfois l'épaule en cas de traumatisme spécifique.", isCorrect: true, comment: "Correct, une attelle à dépression peut être utilisée pour immobiliser ces parties du corps en cas de traumatisme." },
          { "text": "Uniquement le coude et le genou.", isCorrect: false, comment: "Une attelle à dépression peut être utilisée pour plus de parties du corps en cas de besoin spécifique." },
          { "text": "Seulement l'avant-bras et la cheville.", isCorrect: false, comment: "D'autres parties du corps peuvent également être immobilisées avec une attelle à dépression en cas de besoin." },
          { "text": "Exclusivement le coude et la cheville.", isCorrect: false, comment: "D'autres parties du corps peuvent également être immobilisées avec une attelle à dépression en secourisme." }
        ]
      },
      {
        "text": "Quel est l'objectif principal de l'immobilisation à l'aide d'une attelle à dépression ?",
        answers: [
          { "text": "Limiter les mouvements d'un membre traumatisé, réduire la douleur et prévenir les complications.", isCorrect: true, comment: "C'est correct, l'attelle à dépression vise à stabiliser le membre blessé pour favoriser la guérison." },
          { "text": "Maintenir le membre dans une position confortable.", isCorrect: false, comment: "L'immobilisation vise à stabiliser le membre pour éviter les mouvements excessifs et réduire la douleur." },
          { "text": "Empêcher toute mobilité du membre traumatisé.", isCorrect: false, comment: "L'objectif est de limiter les mouvements tout en permettant une certaine circulation sanguine et confort pour la victime." },
          { "text": "Assurer une compression élevée du membre blessé.", isCorrect: false, comment: "L'immobilisation vise à stabiliser le membre sans exercer de compression excessive." }
        ]
      },
      {
        "text": "Quel est le composant essentiel d'une attelle à dépression utilisée ?",
        answers: [
          { "text": "Une enveloppe étanche à l'air contenant des billes de polystyrène expansé et une vanne d'admission d'air.", isCorrect: true, comment: "Exact, ces composants permettent de créer et de maintenir la dépression nécessaire à l'immobilisation du membre." },
          { "text": "Des sangles de maintien solides.", isCorrect: false, comment: "Les sangles sont importantes mais l'enveloppe étanche et la vanne d'admission d'air sont essentielles pour créer la dépression." },
          { "text": "Un dispositif de traction manuelle.", isCorrect: false, comment: "La traction n'est pas le principe de fonctionnement d'une attelle à dépression." },
          { "text": "Des supports rigides en plastique.", isCorrect: false, comment: "Une attelle à dépression utilise un matériau souple pour épouser la forme du membre blessé." }
        ]
      },
      {
        "text": "Quelle est la méthode de fonctionnement d'une attelle à dépression ?",
        answers: [
          { "text": "Créer une dépression à l'intérieur de l'enveloppe étanche pour immobiliser le membre de manière rigide.", isCorrect: true, comment: "Oui, la dépression maintient le membre immobilisé dans une position confortable." },
          { "text": "Appliquer une compression élevée autour du membre blessé.", isCorrect: false, comment: "L'objectif n'est pas d'appliquer une compression élevée mais de maintenir le membre de manière stable." },
          { "text": "Utiliser des supports rigides pour maintenir le membre en place.", isCorrect: false, comment: "Une attelle à dépression utilise un matériau souple et une dépression pour l'immobilisation." },
          { "text": "Exercer une traction continue sur le membre pour le réaligner.", isCorrect: false, comment: "La traction n'est pas le principe de fonctionnement d'une attelle à dépression." }
        ]
      },
      {
        "text": "Combien de secouristes sont nécessaires pour mettre en place une attelle à dépression sur un membre inférieur ?",
        answers: [
          { "text": "Trois secouristes au minimum.", isCorrect: true, comment: "Oui, la mise en place nécessite trois secouristes pour maintenir, préparer et placer correctement l'attelle." },
          { "text": "Deux secouristes au minimum.", isCorrect: false, comment: "Pour un membre inférieur, trois secouristes sont nécessaires pour garantir une immobilisation correcte." },
          { "text": "Quatre secouristes au minimum.", isCorrect: false, comment: "Trois secouristes sont suffisants pour mettre en place une attelle à dépression sur un membre inférieur." },
          { "text": "Un seul secouriste suffit.", isCorrect: false, comment: "La mise en place d'une attelle à dépression nécessite une coordination entre plusieurs secouristes." }
        ]
      },
      {
        "text": "Quelle est la première étape pour mettre en place une attelle à dépression sur un membre inférieur ?",
        answers: [
          { "text": "Maintenir le membre blessé, après réalignement si nécessaire, au niveau des articulations sus et sous-jacentes au traumatisme.", isCorrect: true, comment: "Oui, il est essentiel de maintenir le membre dans une position correcte avant de placer l'attelle." },
          { "text": "Préparer l'attelle en répartissant les billes de manière égale.", isCorrect: false, comment: "La préparation de l'attelle vient après avoir stabilisé le membre blessé." },
          { "text": "Faire le vide à l'intérieur de l'attelle à dépression.", isCorrect: false, comment: "Le vide à l'intérieur de l'attelle est réalisé après l'avoir placée sous le membre." },
          { "text": "Passer les sangles de maintien autour du membre blessé.", isCorrect: false, comment: "Les sangles sont utilisées après avoir placé correctement l'attelle sous le membre." }
        ]
      },
      {
        "text": "Comment le vide à l'intérieur de l'attelle à dépression est-il créé pour immobiliser le membre ?",
        answers: [
          { "text": "En aspirant l'air à travers la vanne d'admission jusqu'à ce que l'attelle devienne rigide.", isCorrect: true, comment: "Oui, l'immobilisation se fait en retirant l'air à l'intérieur de l'attelle pour la rendre rigide." },
          { "text": "En injectant de l'air à travers la vanne d'admission jusqu'à ce que l'attelle devienne ferme.", isCorrect: false, comment: "Le vide est créé en retirant l'air à l'intérieur de l'attelle, pas en ajoutant de l'air." },
          { "text": "En chauffant l'attelle pour la rendre rigide.", isCorrect: false, comment: "Le vide est créé par l'extraction de l'air, pas par chauffage." },
          { "text": "En utilisant des supports externes pour maintenir le membre en place.", isCorrect: false, comment: "L'immobilisation est réalisée en retirant l'air à l'intérieur de l'attelle, pas en utilisant des supports externes." }
        ]
      },
      {
        "text": "Quels sont les risques liés à une mauvaise mise en place d'une attelle à dépression sur un membre traumatisé ?",
        answers: [
          { "text": "Aucun risque n'est associé à une mauvaise mise en place d'une attelle à dépression.", isCorrect: false, comment: "Une mauvaise immobilisation peut avoir des conséquences néfastes pour la victime." },
          { "text": "Mobilisation du membre, douleur accrue et risque de complications.", isCorrect: true, comment: "Oui, une mauvaise immobilisation peut aggraver les blessures et augmenter les risques pour la victime." },
          { "text": "Diminution de la circulation sanguine dans le membre.", isCorrect: false, comment: "La mauvaise mise en place peut entraîner des complications, mais cela ne concerne pas directement la circulation sanguine." },
          { "text": "Augmentation de la douleur due à une compression excessive.", isCorrect: false, comment: "Une mauvaise immobilisation peut en effet aggraver la douleur mais pas uniquement en raison d'une compression excessive." },
          
        ]
      },
      {
        "text": "Quels critères indiquent une immobilisation correcte à l'aide d'une attelle à dépression ?",
        answers: [
                    { "text": "La victime ne ressent aucune douleur après l'immobilisation.", isCorrect: false, comment: "La douleur peut diminuer mais cela seul ne garantit pas une immobilisation correcte." },
          { "text": "Une compression élevée est exercée autour du membre blessé.", isCorrect: false, comment: "Une immobilisation efficace n'implique pas une compression excessive." },
          { "text": "Le segment blessé et les articulations sus et sous-jacentes sont immobilisés, l'attelle est correctement fixée, la douleur diminue et aucune compression excessive n'est présente.", isCorrect: true, comment: "Oui, ces critères indiquent une immobilisation efficace et sûre." },

          { "text": "L'attelle est maintenue en place par des sangles solides.", isCorrect: false, comment: "La fixation de l'attelle est importante mais ne suffit pas à garantir une immobilisation correcte." }
        ]
      },
      {
        "text": "Quelle est la différence principale entre une attelle à dépression et une attelle classique ?",
        answers: [
                { "text": "Une attelle à dépression est plus confortable pour la victime.", isCorrect: false, comment: "Le confort peut varier mais la différence principale réside dans le mode d'immobilisation." },
                { "text": "Une attelle à dépression utilise une enveloppe étanche à l'air pour créer une immobilisation rigide, tandis qu'une attelle classique utilise des matériaux rigides ou souples pour maintenir le membre en place.", isCorrect: true, comment: "Exact, l'attelle à dépression crée un environnement stable en retirant l'air à l'intérieur." },
          { "text": "Une attelle à dépression est plus rapide à mettre en place en cas d'urgence.", isCorrect: false, comment: "La rapidité peut varier mais la différence clé réside dans la méthode d'immobilisation utilisée." },
          { "text": "Une attelle à dépression est utilisée uniquement pour les membres inférieurs.", isCorrect: false, comment: "Une attelle à dépression peut être utilisée pour divers membres du corps en cas de besoin." }
        ]
      },
      {
        "text": "Quel est le rôle de la vanne d'admission d'air sur une attelle à dépression ?",
        answers: [
          { "text": "Elle permet de contrôler le vide à l'intérieur de l'attelle en régulant l'entrée et la sortie d'air.", isCorrect: true, comment: "Oui, la vanne est essentielle pour créer et maintenir la dépression nécessaire à l'immobilisation." },
          { "text": "Elle maintient l'attelle en place sur le membre blessé.", isCorrect: false, comment: "La vanne contrôle la pression d'air à l'intérieur de l'attelle, mais elle n'affecte pas directement sa fixation." },
          { "text": "Elle renforce la rigidité de l'attelle une fois mise en place.", isCorrect: false, comment: "La vanne régule le vide d'air à l'intérieur de l'attelle pour garantir une immobilisation correcte." },
          { "text": "Elle assure le confort de la victime pendant l'immobilisation.", isCorrect: false, comment: "La vanne contrôle le vide à l'intérieur de l'attelle pour maintenir une position stable du membre." }
        ]
      },
      {
        "text": "Quel est l'avantage principal de l'utilisation d'une attelle à dépression par rapport à une attelle classique  ?",
        answers: [
          { "text": "Elle peut créer une immobilisation rigide et confortable en épousant parfaitement la forme du membre blessé.", isCorrect: true, comment: "Oui, l'attelle à dépression offre une immobilisation plus personnalisée et efficace grâce à la dépression créée à l'intérieur." },
          { "text": "Elle est plus facile à mettre en place en cas d'urgence.", isCorrect: false, comment: "La facilité de mise en place peut varier mais la personnalisation de l'immobilisation est un avantage clé de l'attelle à dépression." },
          { "text": "Elle permet d'appliquer une pression élevée sur le membre blessé pour réduire l'enflure.", isCorrect: false, comment: "L'objectif n'est pas d'appliquer une pression élevée mais de créer une immobilisation stable sans compression excessive." },
          { "text": "Elle peut être utilisée sur tous les types de membres sans adaptation supplémentaire.", isCorrect: false, comment: "Une attelle à dépression peut être utilisée sur divers membres mais nécessite une adaptation selon le cas." }
        ]
      },
      {
        "text": "Quel est le rôle du secouriste 3 lors de la mise en place d'une attelle à dépression sur un membre inférieur ?",
        answers: [
          { "text": "Préparer l'attelle en répartissant les billes et ouvrir la valve d'admission d'air.", isCorrect: true, comment: "Oui, le secouriste 3 prépare l'attelle et commence le processus d'immobilisation en ouvrant la valve." },
          { "text": "Faire le vide à l'intérieur de l'attelle une fois en place.", isCorrect: false, comment: "Le vide est réalisé après que l'attelle a été correctement positionnée sous le membre." },
          { "text": "Maintenir le membre blessé en place pendant la mise en place de l'attelle.", isCorrect: false, comment: "Le secouriste 3 est responsable de la préparation initiale de l'attelle avant son placement sous le membre." },
          { "text": "Passer les sangles de maintien autour du membre après la mise en place de l'attelle.", isCorrect: false, comment: "Les sangles sont utilisées après que l'attelle a été correctement positionnée sous le membre." }
        ]
      },
      {
        "text": "Quel est le rôle du secouriste 1 lors de la mise en place d'une attelle à dépression sur un membre inférieur ?",
        answers: [
          { "text": "Maintenir le membre blessé, après réalignement si nécessaire, au niveau des articulations sus et sous-jacentes au traumatisme jusqu'à la mise en place de l'attelle.", isCorrect: true, comment: "Oui, le secouriste 1 est chargé de maintenir le membre dans une position correcte avant et pendant la mise en place de l'attelle." },
          { "text": "Faire le vide à l'intérieur de l'attelle une fois en place.", isCorrect: false, comment: "Le vide est réalisé après que l'attelle a été correctement positionnée sous le membre." },
          { "text": "Maintenir le membre blessé en place pendant la mise en place de l'attelle.", isCorrect: false, comment: "Le secouriste 1 est responsable de maintenir le membre pendant que les autres secouristes placent l'attelle." },
          { "text": "Passer les sangles de maintien autour du membre après la mise en place de l'attelle.", isCorrect: false, comment: "Les sangles sont utilisées après que l'attelle a été correctement positionnée sous le membre." }
        ]
      },
      {
        "text": "Quel est le principal risque associé à une attelle à dépression mal positionnée sur un membre traumatisé ?",
        answers: [
                   { "text": "Diminution de la circulation sanguine dans le membre.", isCorrect: false, comment: "La mauvaise position peut affecter la circulation mais le risque principal est le mouvement non contrôlé du membre." },
          { "text": "Aucun risque n'est associé à une mauvaise position d'une attelle à dépression.", isCorrect: false, comment: "Une attelle mal positionnée peut avoir des conséquences néfastes pour la victime." }, 
          { "text": "Mouvement non contrôlé du membre, douleur accrue et risque de complications.", isCorrect: true, comment: "Oui, une attelle mal positionnée peut aggraver les blessures et entraîner des complications pour la victime." },
          { "text": "Compression excessive du membre blessé.", isCorrect: false, comment: "Une attelle mal positionnée peut effectivement causer une compression excessive mais le risque principal est le mouvement non contrôlé du membre." },

        ]
      },
      {
        "text": "Quel est le critère le plus important pour évaluer une immobilisation correcte à l'aide d'une attelle à dépression ?",
        answers: [
          { "text": "L'immobilisation des articulations et segments blessés, la fixation sécurisée de l'attelle, la diminution de la douleur et l'absence de compression excessive.", isCorrect: true, comment: "Oui, ces critères sont essentiels pour garantir une immobilisation efficace et sûre." },
          { "text": "L'absence totale de douleur chez la victime.", isCorrect: false, comment: "La douleur peut diminuer mais cela seul ne garantit pas une immobilisation correcte." },
          { "text": "L'application d'une pression uniforme sur le membre immobilisé.", isCorrect: false, comment: "L'immobilisation efficace implique la fixation sécurisée du membre sans exercer de pression excessive." },
          { "text": "La facilité et la rapidité de mise en place de l'attelle.", isCorrect: false, comment: "La rapidité peut varier mais l'immobilisation correcte est le critère le plus important." }
        ]
      },
      {
        "text": "Qu'est-ce que l'écharpe utilisée lors de l'immobilisation de l'épaule avec une attelle à dépression ?",
        answers: [
          { "text": "Elle est glissée entre les branches de l'attelle pour stabiliser le membre supérieur.", isCorrect: true, comment: "Oui, l'écharpe est utilisée pour maintenir la position du membre supérieur pendant l'immobilisation de l'épaule." },
          { "text": "Elle est utilisée pour renforcer la pression exercée sur l'épaule.", isCorrect: false, comment: "L'écharpe stabilise le membre mais ne sert pas à appliquer une pression supplémentaire." },
          { "text": "Elle renforce la rigidité de l'attelle une fois en place.", isCorrect: false, comment: "L'écharpe contribue à la stabilisation du membre mais ne joue pas un rôle direct dans la rigidité de l'attelle." },
          { "text": "Elle maintient la dépression à l'intérieur de l'attelle pendant l'immobilisation.", isCorrect: false, comment: "L'écharpe sert à stabiliser le membre pendant l'immobilisation de l'épaule." }
        ]
      },
      {
        "text": "Quelle est l'indication principale pour l'utilisation d'une attelle modulable ?",
        answers: [
          { "text": "Assurer l'immobilisation du coude, de l'avant-bras et du poignet pour le membre supérieur, et du genou, de la jambe et de la cheville pour le membre inférieur.", isCorrect: true, comment: "C'est exact, l'attelle modulable est utilisée pour immobiliser ces parties du corps en cas de traumatisme." },
          { "text": "Immobiliser uniquement le membre supérieur en cas de fracture.", isCorrect: false, comment: "L'attelle modulable peut également être utilisée pour le membre inférieur." },
          { "text": "Soutenir le cou en cas de blessure cervicale.", isCorrect: false, comment: "L'attelle modulable est principalement utilisée pour les membres, pas pour le cou." },
          { "text": "Prévenir les blessures musculaires.", isCorrect: false, comment: "L'attelle modulable est utilisée pour immobiliser en cas de traumatisme, pas pour prévenir des blessures musculaires." }
        ]
      },
      {
        "text": "Quel est l'objectif principal de l'immobilisation avec une attelle modulable ?",
        answers: [
          { "text": "Limiter les mouvements d'un membre traumatisé, diminuer la douleur et prévenir les complications.", isCorrect: true, comment: "Oui, l'immobilisation vise à ces objectifs pour assurer un traitement efficace des traumatismes." },
          { "text": "Restreindre la circulation sanguine dans le membre blessé.", isCorrect: false, comment: "L'immobilisation ne vise pas à restreindre la circulation sanguine mais à limiter les mouvements et prévenir les complications." },
          { "text": "Faciliter le transport de la victime vers l'hôpital.", isCorrect: false, comment: "L'immobilisation est importante pour la stabilité du membre traumatisé mais ne concerne pas directement le transport." },
          { "text": "Réduire l'enflure autour de la blessure.", isCorrect: false, comment: "L'immobilisation aide à prévenir les complications mais ne vise pas spécifiquement à réduire l'enflure." }
        ]
      },
      {
        "text": "Pourquoi est-il important de rembourrer les espaces libres entre l'attelle et le membre blessé lors de l'immobilisation ?",
        answers: [
                   { "text": "Pour renforcer la rigidité de l'attelle.", isCorrect: false, comment: "Le rembourrage n'affecte pas la rigidité mais le confort et la stabilité de l'immobilisation." }, { "text": "Pour assurer un contact permanent entre l'attelle et le membre, garantissant ainsi une immobilisation efficace.", isCorrect: true, comment: "Oui, le rembourrage assure une immobilisation stable en évitant les mouvements indésirables." },
          { "text": "Pour rendre l'attelle plus légère.", isCorrect: false, comment: "Le rembourrage vise à améliorer le confort et l'efficacité de l'immobilisation, pas à réduire le poids de l'attelle." },
          { "text": "Pour empêcher l'attelle de bouger pendant le transport.", isCorrect: false, comment: "Le rembourrage vise à stabiliser l'attelle contre le membre blessé, pas à prévenir les mouvements pendant le transport." }
        ]
      },
      {
        "text": "Quelles zones ne doivent pas être affectées par un traumatisme pour que l'attelle à traction puisse être utilisée ?",
        answers: [
          { "text": "La cheville, le pied, le bassin ou la partie inférieure du dos.", isCorrect: true, comment: "Ces zones sont incompatibles avec l'utilisation d'une attelle à traction." },
          { "text": "Le genou et la hanche.", isCorrect: false, comment: "Le genou et la hanche peuvent être affectés sans contre-indiquer nécessairement l'utilisation d'une attelle à traction." },
          { "text": "Le coude et l'épaule.", isCorrect: false, comment: "L'attelle à traction est utilisée pour les membres inférieurs et n'impacte pas les traumatismes du coude ou de l'épaule." },
          { "text": "Le poignet et la main.", isCorrect: false, comment: "Les traumatismes du poignet et de la main ne sont pas concernés par l'attelle à traction." }
        ]
      },
      {
        "text": "Quel est l'effet principal de l'immobilisation avec une attelle à traction sur le membre traumatisé ?",
        answers: [
          { "text": "Limite les mouvements, diminue la douleur et prévient la survenue de complications.", isCorrect: true, comment: "Oui, l'objectif principal de l'immobilisation est de stabiliser le membre et de favoriser la guérison." },
          { "text": "Favorise la flexibilité et la mobilité du membre.", isCorrect: false, comment: "L'immobilisation vise à limiter les mouvements pour permettre une guérison efficace." },
          { "text": "Augmente le risque de complications.", isCorrect: false, comment: "L'immobilisation vise à réduire les complications et à favoriser la guérison." },
          { "text": "Améliore la circulation sanguine dans le membre blessé.", isCorrect: false, comment: "L'immobilisation limite les mouvements pour éviter d'aggraver la blessure." }
        ]
      },
      {
        "text": "Pourquoi une attelle à traction ne peut-elle pas être installée sans la demande et la présence d'un médecin ?",
        answers: [
                  { "text": "Pour accélérer le processus d'immobilisation.", isCorrect: false, comment: "La présence d'un médecin est nécessaire pour des raisons de sécurité et de supervision médicale." },
          { "text": "Pour obtenir une autorisation officielle avant d'utiliser l'attelle.", isCorrect: false, comment: "La présence du médecin garantit une utilisation appropriée de l'attelle, mais ne nécessite pas d'autorisation spécifique." },
          { "text": "Pour permettre au médecin de surveiller la progression de l'immobilisation.", isCorrect: false, comment: "La supervision médicale est cruciale pour garantir l'efficacité et la sécurité de l'immobilisation." }, 
          { "text": "Pour garantir la sécurité et éviter les complications dues à une mauvaise utilisation.", isCorrect: true, comment: "Oui, l'installation d'une attelle à traction nécessite une expertise médicale pour assurer son efficacité et sa sécurité." },
        ]
      },
      {
        "text": "Quel est le principal risque lié à l'utilisation d'une attelle à traction sur un membre non réaligné ?",
        answers: [
          { "text": "Aggraver le traumatisme existant et causer des complications supplémentaires.", isCorrect: true, comment: "Exact, une traction exercée sur un membre non réaligné peut aggraver les blessures et les complications." },
          { "text": "Rendre l'immobilisation plus difficile.", isCorrect: false, comment: "L'immobilisation sur un membre réaligné est nécessaire pour assurer l'efficacité du traitement, pas simplement pour faciliter la procédure." },
          { "text": "Rendre la procédure plus douloureuse pour le patient.", isCorrect: false, comment: "L'alignement du membre n'affecte pas directement la douleur du patient lors de l'immobilisation." },
          { "text": "Diminuer la mobilité du membre blessé.", isCorrect: false, comment: "L'objectif de l'immobilisation est de limiter la mobilité pour éviter d'aggraver les blessures existantes." }
        ]
      },
      {
          "text": "Quand est-il nécessaire d'utiliser une immobilisation du membre supérieur au moyen d'écharpes ?",
          answers: [ 
            { "text": "Pour des traitements médicaux avancés du membre supérieur.", isCorrect: false, comment: "Les écharpes servent principalement à l'immobilisation et ne sont pas liées à des traitements médicaux avancés." },
              { "text": "Lorsque des moyens plus appropriés ne sont pas disponibles pour mobiliser la victime.", isCorrect: true, comment: "Effectivement, les écharpes sont utilisées quand d'autres moyens d'immobilisation ne sont pas disponibles." },
              { "text": "Uniquement en cas de fractures graves du membre supérieur.", isCorrect: false, comment: "Les écharpes peuvent être utilisées plus largement que pour les fractures graves, lorsque d'autres moyens ne sont pas disponibles." },
              { "text": "En présence de complications circulatoires graves.", isCorrect: false, comment: "Les écharpes ne sont pas spécifiquement réservées aux complications circulatoires, mais plutôt à l'immobilisation générale du membre supérieur." },
            
          ]
      },
      {
          "text": "Quel est l'objectif principal d'une immobilisation avec des écharpes pour le membre supérieur ?",
          answers: [
              { "text": "Limiter les mouvements, diminuer la douleur et prévenir les complications.", isCorrect: true, comment: "C'est correct. L'immobilisation avec des écharpes vise à atteindre ces objectifs en bloquant les articulations autour du traumatisme." },
              { "text": "Assurer un confort maximal au patient.", isCorrect: false, comment: "Bien que le confort soit important, l'objectif principal est l'immobilisation pour prévenir les complications." },
              { "text": "Restaurer complètement la fonctionnalité du membre.", isCorrect: false, comment: "L'immobilisation ne vise pas à restaurer la fonctionnalité, mais à limiter les mouvements pour favoriser la guérison." },
              { "text": "Réduire instantanément le gonflement du membre.", isCorrect: false, comment: "L'immobilisation ne traite pas directement le gonflement, mais vise à limiter les mouvements et la douleur." }
          ]
      },
      {
          "text": "Comment doit être positionné le sommet d'une écharpe triangulaire lors de l'immobilisation du membre supérieur ?",
          answers: [

              { "text": "Du côté de l'épaule opposée au membre blessé.", isCorrect: false, comment: "Le sommet doit être du côté du coude pour une immobilisation correcte." },
              { "text": "Au niveau de la main.", isCorrect: false, comment: "Le sommet de l'écharpe doit être plus haut, du côté du coude." },              
              { "text": "Du côté du coude.", isCorrect: true, comment: "Oui, le sommet de l'écharpe doit être du côté du coude pour une immobilisation efficace." },
              { "text": "Au niveau du poignet.", isCorrect: false, comment: "Le sommet de l'écharpe doit être plus haut, du côté du coude." }
          ]
      }, 
      {
          "text": "Où doivent être nouées les pointes de l'écharpe triangulaire utilisée pour immobiliser le membre supérieur ?",
          answers: [
              { "text": "Sur le côté du cou.", isCorrect: true, comment: "Oui, les pointes de l'écharpe doivent être nouées sur le côté du cou pour sécuriser l'immobilisation." },
              { "text": "Autour du bras.", isCorrect: false, comment: "Les pointes doivent être nouées au niveau du cou, pas autour du bras." },
              { "text": "Autour du poignet.", isCorrect: false, comment: "Les pointes doivent être nouées au niveau du cou, pas autour du poignet." },
              { "text": "Autour de l'épaule opposée au membre blessé.", isCorrect: false, comment: "Les pointes doivent être nouées sur le côté du cou pour sécuriser l'immobilisation." }
          ]
      },
      {
          "text": "Quelle est la position idéale de la main lors de l'immobilisation avec une écharpe triangulaire pour un traumatisme du membre supérieur ?",
          answers: [
              { "text": "Légèrement au-dessus du niveau du coude.", isCorrect: true, comment: "Oui, la main doit être positionnée légèrement au-dessus du niveau du coude lors de l'immobilisation." },
              { "text": "À la hauteur du coude.", isCorrect: false, comment: "La main doit être légèrement au-dessus du niveau du coude pour une immobilisation correcte." },
              { "text": "Au niveau de l'épaule opposée au membre blessé.", isCorrect: false, comment: "La main doit être légèrement au-dessus du niveau du coude pour une immobilisation correcte." },
              { "text": "À la hauteur du poignet.", isCorrect: false, comment: "La main doit être légèrement au-dessus du niveau du coude pour une immobilisation correcte." }
          ]
      },
  {
      "text": "Qu'est-ce qu'un plan dur ?",
      answers: [
        { "text": "Un outil rigide utilisé pour l'immobilisation et le transfert de victimes en cas de traumatisme du rachis.", isCorrect: true, comment: "Exact, le plan dur est un dispositif rigide essentiel en cas de suspicion de traumatisme du rachis." },
        { "text": "Une méthode utilisée en cas de situation critique.", isCorrect: false, comment: "Ce n'est pas la définition précise d'un plan dur en secourisme." },
        { "text": "Un protocole de prise en charge des blessés sur le terrain.", isCorrect: false, comment: "Cela ne définit pas spécifiquement ce qu'est un plan dur en secourisme." },
        { "text": "Un dispositif pour transporter les victimes par hélicoptère.", isCorrect: false, comment: "Cette définition ne correspond pas à celle d'un plan dur." }
      ]
  },
  {
      "text": "Quelles sont les caractéristiques importantes d'un plan dur ?",
      answers: [        { "text": "Flexibilité et opacité.", isCorrect: false, comment: "Un plan dur doit être rigide et radiotransparent." },
        { "text": "Rigidité, radiotransparence, résistance à l'eau.", isCorrect: true, comment: "Ces caractéristiques sont essentielles pour un plan dur en secourisme." },
        { "text": "Flexibilité et légèreté.", isCorrect: false, comment: "Un plan dur doit être rigide plutôt que flexible pour l'immobilisation." },
        { "text": "Opacité et légèreté.", isCorrect: false, comment: "L'opacité n'est pas une caractéristique souhaitable pour un plan dur en secourisme." },

      ]
  },
  {
      "text": "À quoi sert l'immobilisateur de tête utilisé avec un plan dur ?",
      answers: [
        { "text": "À limiter les mouvements de la tête et du cou en cas de suspicion de traumatisme du rachis.", isCorrect: true, comment: "Exact, l'immobilisateur de tête est crucial pour prévenir les lésions de la colonne cervicale." },
        { "text": "À soutenir la victime pendant le transport.", isCorrect: false, comment: "Cette réponse ne décrit pas correctement le rôle de l'immobilisateur de tête." },
        { "text": "À fournir un confort supplémentaire à la victime.", isCorrect: false, comment: "Le rôle principal de l'immobilisateur de tête est la sécurité, pas le confort." },
        { "text": "À maintenir la victime éveillée.", isCorrect: false, comment: "L'immobilisateur de tête n'est pas utilisé pour maintenir la victime éveillée." }
      ]
  },
  {
      "text": "Comment est constitué l'immobilisateur de tête utilisé avec un plan dur ?",
      answers: [      { "text": "D'un dispositif en mousse uniquement.", isCorrect: false, comment: "La mousse seule ne fournit pas suffisamment de soutien pour l'immobilisation de la tête." },        { "text": "D'une ceinture abdominale et de sangles thoraciques.", isCorrect: false, comment: "Ce type de dispositif est utilisé pour d'autres types de maintien mais pas spécifiquement pour l'immobilisation de la tête." },
        { "text": "D'un coussin de tête, de blocs d'immobilisation latéraux et de sangles de fixation frontale et mentonnière.", isCorrect: true, comment: "C'est exact, l'immobilisateur de tête est composé de plusieurs éléments pour assurer la stabilité de la tête et du cou." },
        { "text": "D'une seule bande de maintien autour de la tête.", isCorrect: false, comment: "Un seul élément ne suffit pas pour un bon maintien de la tête en cas de traumatisme du rachis." },
  

      ]
  },
  {
      "text": "Pourquoi utilise-t-on un plan dur avec un immobilisateur de tête ?",
      answers: [
        { "text": "Pour limiter les mouvements de la tête et du cou en cas de suspicion de traumatisme du rachis.", isCorrect: true, comment: "Exact, cette combinaison est cruciale pour éviter d'aggraver les lésions de la colonne cervicale." },
        { "text": "Pour maintenir la victime en position debout.", isCorrect: false, comment: "Cette réponse ne décrit pas correctement l'utilisation d'un plan dur avec un immobilisateur de tête." },
        { "text": "Pour protéger la victime du froid.", isCorrect: false, comment: "L'utilisation principale d'un plan dur avec un immobilisateur de tête est liée à l'immobilisation en cas de traumatisme du rachis." },
        { "text": "Pour faciliter le transfert vers un brancard.", isCorrect: false, comment: "Le but principal n'est pas seulement le transfert mais l'immobilisation de la tête et du cou." }
      ]
  },
  {
      "text": "Quelle est l'utilité principale du plan dur ?",
      answers: [
        { "text": "Immobiliser et transférer les victimes en cas de suspicion de traumatisme du rachis.", isCorrect: true, comment: "C'est la fonction principale du plan dur dans les interventions d'urgence." },
        { "text": "Maintenir les secouristes stables sur le terrain.", isCorrect: false, comment: "Bien que la stabilité soit importante, ce n'est pas le rôle principal d'un plan dur en secourisme." },
        { "text": "Servir de support pour l'administration de premiers soins.", isCorrect: false, comment: "Un plan dur est utilisé pour l'immobilisation plutôt que pour l'administration de premiers soins." },
        { "text": "Protéger les victimes des intempéries.", isCorrect: false, comment: "Ce n'est pas la principale utilité d'un plan dur en secourisme." }
      ]
  },
  {
      "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère ?",
      answers: [
        { "text": "La technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la méthode recommandée lorsque le brancard cuillère n'est pas disponible." },
        { "text": "La technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est utilisée si d'autres techniques ne peuvent pas être réalisées." },
        { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas recommandée pour transférer une victime sur un plan dur." },
        { "text": "La technique du levage direct sur le plan dur.", isCorrect: false, comment: "Cette méthode peut être risquée sans l'utilisation appropriée d'équipement." }
      ]
  },
  {
      "text": "Quelle est la procédure à suivre pour installer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère ?",
      answers: [
        { "text": "Utiliser la technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la procédure recommandée pour transférer une victime sur un plan dur sans brancard cuillère." },
        { "text": "Utiliser la technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est une alternative si le pont à quatre porteurs n'est pas possible." },
        { "text": "Utiliser la technique du levage direct sur le plan dur.", isCorrect: false, comment: "Le levage direct peut être dangereux sans équipement approprié." },
        { "text": "Utiliser un brancard souple pour le transfert sur le plan dur.", isCorrect: false, comment: "Un brancard souple n'est pas recommandé pour le transfert sur un plan dur en l'absence de brancard cuillère." }
      ]
  },
  {
      "text": "Quelle est la priorité lors de l'installation d'une victime sur un plan dur ?",
      answers: [
        { "text": "Maintenir l'axe tête-cou-tronc de la victime.", isCorrect: true, comment: "C'est la priorité principale pour éviter d'aggraver une éventuelle lésion de la colonne vertébrale." },
        { "text": "S'assurer que la victime est confortable.", isCorrect: false, comment: "Le confort n'est pas la priorité principale lors de l'installation sur un plan dur en secourisme." },
        { "text": "S'assurer que la victime est consciente.", isCorrect: false, comment: "La conscience de la victime est importante mais ce n'est pas la priorité principale lors de l'installation sur un plan dur." },
        { "text": "Vérifier la température corporelle de la victime.", isCorrect: false, comment: "La température corporelle n'est pas la priorité lors de l'installation sur un plan dur." }
      ]
  },
  {
      "text": "Combien d'intervenants sont nécessaires pour installer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère ?",
      answers: [
        { "text": "Trois intervenants.", isCorrect: true, comment: "Trois intervenants sont nécessaires pour effectuer cette procédure efficacement." },
        { "text": "Deux intervenants.", isCorrect: false, comment: "Deux intervenants ne seraient pas suffisants pour cette procédure spécifique." },
        { "text": "Quatre intervenants.", isCorrect: false, comment: "Quatre intervenants seraient excessifs pour cette procédure." },
        { "text": "Un seul intervenant.", isCorrect: false, comment: "Un seul intervenant ne peut pas réaliser cette procédure de manière sûre et efficace." }
      ]
  },
  {
      "text": "Quelle est la position de la victime pendant l'installation sur un plan dur en l'absence de brancard cuillère ?",
      answers: [
        { "text": "Allongée sur le dos.", isCorrect: true, comment: "C'est la position de base pour cette procédure d'installation sur un plan dur." },
        { "text": "Allongée sur le ventre.", isCorrect: false, comment: "Cette position n'est pas utilisée pour l'installation sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Debout.", isCorrect: false, comment: "La victime ne serait pas debout pendant cette procédure d'installation sur un plan dur." },
        { "text": "Assise.", isCorrect: false, comment: "La position assise n'est pas utilisée pour cette procédure." }
      ]
  },
  {
      "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le ventre sur un plan dur ?",
      answers: [
        { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
        { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
        { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Cette méthode n'est pas recommandée sans équipement adéquat." },
        { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas utilisé pour cette procédure." }
      ]
  },
  {
      "text": "Quelle est la position de la victime pendant le transfert sur un plan dur en l'absence de brancard cuillère ?",
      answers: [
        { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
        { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
      ]
  },
  {
      "text": "Quelle est la technique appropriée pour transférer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère ?",
      answers: [
        { "text": "La technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime sur un plan dur sans brancard cuillère." },
        { "text": "La technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est une alternative si le pont à quatre porteurs n'est pas possible." },
        { "text": "La technique du levage direct sur le plan dur.", isCorrect: false, comment: "Le levage direct peut être dangereux sans équipement approprié." },
        { "text": "La technique du retournement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas recommandé pour le transfert sur un plan dur en l'absence de brancard cuillère." }
      ]
  },
      {
          "text": "Quelle est la position de la victime pendant l'installation sur un plan dur en l'absence de brancard cuillère ?",
          answers: [

            { "text": "Allongée sur le ventre.", isCorrect: false, comment: "Cette position n'est pas utilisée pour l'installation sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Debout.", isCorrect: false, comment: "La victime ne serait pas debout pendant cette procédure d'installation sur un plan dur." },            { "text": "Allongée sur le dos.", isCorrect: true, comment: "C'est la position de base pour cette procédure d'installation sur un plan dur." },
            { "text": "Assise.", isCorrect: false, comment: "La position assise n'est pas utilisée pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le ventre sur un plan dur ?",
          answers: [
            { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Cette méthode n'est pas recommandée sans équipement adéquat." },
            { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas utilisé pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la position de la victime pendant le transfert sur un plan dur en l'absence de brancard cuillère ?",
          answers: [
            { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
            { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
          ]
      },
      {
          "text": "Quelle est la procédure recommandée pour transférer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère ?",
          answers: [
            { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas approprié pour cette procédure." },
            { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Le levage direct n'est pas recommandé pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la position de la victime pendant l'installation sur un plan dur en l'absence de brancard cuillère ?",
          answers: [
            { "text": "Allongée sur le dos.", isCorrect: true, comment: "C'est la position de base pour cette procédure d'installation sur un plan dur." },
            { "text": "Allongée sur le ventre.", isCorrect: false, comment: "Cette position n'est pas utilisée pour l'installation sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Debout.", isCorrect: false, comment: "La victime ne serait pas debout pendant cette procédure d'installation sur un plan dur." },
            { "text": "Assise.", isCorrect: false, comment: "La position assise n'est pas utilisée pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le ventre sur un plan dur ?",
          answers: [
            { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Cette méthode n'est pas recommandée sans équipement adéquat." },
            { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas utilisé pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la position de la victime pendant le transfert sur un plan dur en l'absence de brancard cuillère ?",
          answers: [
            { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
            { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
          ]
      },
        {
            text: "Quel est le but principal de l'immobilisation avec un matelas à dépression ?",
            answers: [
              { text: "Respecter l'axe tête-cou-tronc de la victime et limiter les mouvements de la colonne vertébrale.", isCorrect: true, comment: "Exact, l'immobilisation vise à prévenir les lésions de la colonne vertébrale." },
              { text: "Stabiliser les membres inférieurs uniquement.", isCorrect: false, comment: "L'immobilisation vise l'ensemble du corps et pas seulement les membres inférieurs." },
              { text: "Réduire le temps d'intervention des secours.", isCorrect: false, comment: "L'immobilisation n'est pas liée à la rapidité d'intervention des secours." },
              { text: "Faciliter le confort de la victime.", isCorrect: false, comment: "Le confort n'est pas le principal objectif de l'immobilisation avec un matelas à dépression." }
            ]
        },
        {
            text: "Quelles sont les indications d'utilisation du matelas immobilisateur à dépression ?",
            answers: [
              { text: "Pour toute victime nécessitant un transport rapide vers l'hôpital.", isCorrect: false, comment: "Le matelas est utilisé pour l'immobilisation et non pour le transport rapide." },
              { text: "Traumatisme de la colonne vertébrale, du bassin ou de la cuisse, ou présence de multiples lésions chez la victime.", isCorrect: true, comment: "Exact, ces indications justifient l'utilisation du matelas immobilisateur à dépression." },
              { text: "Uniquement en cas de détresse respiratoire de la victime.", isCorrect: false, comment: "Le matelas peut être utilisé dans divers scénarios, pas uniquement pour la détresse respiratoire." },
              { text: "Pour les victimes souffrant de blessures aux membres supérieurs.", isCorrect: false, comment: "Le matelas est principalement utilisé pour l'immobilisation de la colonne vertébrale." }
            ]
        },
        {
            text: "Dans quelles situations le matelas immobilisateur à dépression permet-il d'immobiliser les victimes dans une position adaptée à leur détresse ?",
            answers: [
              { text: "Lorsque la victime présente une détresse respiratoire, en l'immobilisant dans une position demi-assise.", isCorrect: true, comment: "Exact, le MID peut être utilisé pour adapter la position selon la détresse de la victime." },
              { text: "Uniquement pour les victimes en position allongée sur le dos.", isCorrect: false, comment: "Le MID peut adapter la position en fonction de diverses détresses, pas seulement en position allongée." },
              { text: "Pour les victimes avec des blessures aux membres inférieurs.", isCorrect: false, comment: "Le MID vise principalement à l'immobilisation de la colonne vertébrale et non des membres inférieurs." },
              { text: "Pour toute victime nécessitant un transport rapide vers l'hôpital.", isCorrect: false, comment: "Le MID est utilisé pour l'immobilisation et non pour le transport rapide." }
            ]
        },
        {
            text: "Quelle est la position recommandée de la victime pendant l'installation sur un matelas à dépression ?",
            answers: [
              { text: "Sur le dos, alignée avec l'axe tête-cou-tronc.", isCorrect: true, comment: "Exact, la victime doit être alignée pour assurer l'immobilisation correcte de la colonne vertébrale." },
              { text: "Sur le ventre, en position de récupération.", isCorrect: false, comment: "La position sur le ventre n'est pas recommandée pour l'immobilisation sur un matelas à dépression." },
              { text: "En position assise, avec les jambes pliées.", isCorrect: false, comment: "La position assise n'est pas recommandée pour l'immobilisation sur un matelas à dépression." },
              { text: "En position demi-assise pour faciliter la respiration.", isCorrect: false, comment: "La position demi-assise est utilisée en cas de détresse respiratoire mais pas nécessairement pour l'immobilisation." }
            ]
        },
        {
            text: "Que faire si le matelas à dépression appuie sur le sommet du crâne de la victime ?",
            answers: [
              { text: "Repositionner le matelas pour éviter tout appui sur le sommet du crâne.", isCorrect: true, comment: "Exact, il est crucial d'éviter tout appui sur le sommet du crâne pour prévenir les blessures." },
              { text: "Utiliser des blocs de tête pour stabiliser le matelas.", isCorrect: false, comment: "Les blocs de tête sont utilisés pour stabiliser le rachis cervical, pas pour le sommet du crâne." },
              { text: "Appliquer un coussin supplémentaire pour soutenir la tête de la victime.", isCorrect: false, comment: "Le matelas ne doit pas appuyer sur le sommet du crâne, donc ajouter un coussin ne résoudrait pas le problème." },
              { text: "Régler le robinet pour dégonfler légèrement le matelas.", isCorrect: false, comment: "Il faut éviter l'appui sur le sommet du crâne en repositionnant correctement le matelas." }
            ]
        },
        {
            text: "Quel est le risque si la rigidité du matelas à dépression diminue pendant l'immobilisation ?",
            answers: [
              { text: "Une diminution de la qualité de l'immobilisation générale de la victime.", isCorrect: true, comment: "Exact, la rigidité du matelas est essentielle pour maintenir une immobilisation efficace." },
              { text: "Une augmentation du confort de la victime.", isCorrect: false, comment: "La diminution de la rigidité compromet la qualité de l'immobilisation, pas le confort." },
              { text: "Une réduction de l'irritation cutanée.", isCorrect: false, comment: "La rigidité du matelas est nécessaire pour l'immobilisation, pas pour réduire l'irritation cutanée." },
              { text: "Un risque accru de déplacement de la victime.", isCorrect: false, comment: "La diminution de la rigidité peut affecter l'immobilisation mais ne provoque pas directement un déplacement de la victime." }
            ]
        },
        {
            text: "Comment doit se faire le transport de la victime une fois immobilisée sur le matelas à dépression ?",
            answers: [
              { text: "En déposant l'ensemble victime-matelas sur un brancard ou un plan dur, puis en l'arrimant pour éviter les mouvements.", isCorrect: true, comment: "Exact, le transport doit être sécurisé pour maintenir l'immobilisation de la victime." },
              { text: "En transportant la victime à mains nues pour éviter tout risque de déplacement.", isCorrect: false, comment: "Le transport à mains nues n'assure pas une immobilisation adéquate." },
              { text: "En dégonflant légèrement le matelas pour faciliter le transport.", isCorrect: false, comment: "Il faut maintenir la rigidité du matelas pendant le transport pour l'immobilisation de la victime." },
              { text: "En retirant le matelas et en transportant la victime seule.", isCorrect: false, comment: "Le matelas doit rester en place pour maintenir l'immobilisation lors du transport." }
            ]
        },
        {
            text: "Que faire si le matelas immobilisateur à dépression (MIseul doit être utilisé pour un transport de courte distance ?",
            answers: [
              { text: "Soutenir le matelas sur les côtés pour éviter qu'il ne se plie en son milieu pendant le transport.", isCorrect: true, comment: "Exact, il faut maintenir le matelas rigide lors du transport pour assurer l'immobilisation." },
              { text: "Gonfler légèrement le matelas pour réduire son poids pendant le transport.", isCorrect: false, comment: "Il faut maintenir la rigidité du matelas pour l'immobilisation, pas le gonfler." },
              { text: "Dégonfler le matelas pour réduire l'espace occupé pendant le transport.", isCorrect: false, comment: "Le matelas doit rester rigide pour maintenir l'immobilisation, même lors d'un transport de courte distance." },
              { text: "Transporter la victime sans utiliser le matelas pour plus de facilité.", isCorrect: false, comment: "Le matelas doit être utilisé pour maintenir l'immobilisation de la victime pendant le transport." }
            ]
        },
        {
            text: "Qu'est-ce qu'une complication possible masquée par l'immobilisation avec un matelas à dépression ?",
            answers: [              { text: "Une aggravation de la détresse respiratoire de la victime.", isCorrect: false, comment: "L'immobilisation vise à stabiliser la victime et ne devrait pas aggraver la détresse respiratoire." },
              { text: "Un déplacement involontaire de la victime pendant le transport.", isCorrect: false, comment: "Le matelas est conçu pour maintenir l'immobilisation et prévenir les déplacements." },
              { text: "Un épanchement de sang ou une hémorragie extériorisée chez la victime.", isCorrect: true, comment: "Exact, le matelas peut masquer des signes d'hémorragie ou d'épanchement sanguin." },
              { text: "Une compression accrue de la colonne vertébrale de la victime.", isCorrect: false, comment: "L'immobilisation vise à protéger la colonne vertébrale, pas à la comprimer davantage." }
            ]
        },
        {
            text: "Pourquoi est-il important de fermer le robinet après l'aspiration de l'air dans le matelas à dépression ?",
            answers: [
              { text: "Pour maintenir la rigidité du matelas en empêchant l'air de revenir à l'intérieur.", isCorrect: true, comment: "Exact, fermer le robinet conserve la rigidité du matelas en bloquant le retour d'air." },
              { text: "Pour permettre à la victime de respirer plus facilement.", isCorrect: false, comment: "Le robinet fermé maintient la rigidité du matelas mais n'influence pas la respiration de la victime." },
              { text: "Pour éviter l'écrasement de la victime sous le poids du matelas.", isCorrect: false, comment: "La fermeture du robinet maintient la rigidité mais n'influence pas le poids du matelas sur la victime." },
              { text: "Pour faciliter le transport du matelas avec la victime.", isCorrect: false, comment: "La fermeture du robinet maintient la rigidité du matelas pour l'immobilisation, pas pour le transport." }
            ]
        },
        {
            text: "Quelle est la condition essentielle pour une bonne immobilisation avec un matelas à dépression ?",
            answers: [
              { text: "Assurer une flexibilité du matelas pour permettre des ajustements.", isCorrect: false, comment: "Le matelas doit rester rigide pour maintenir l'immobilisation, pas flexible." },
              { text: "Maintenir la rigidité du matelas en permanence pour empêcher tout mouvement de la victime.", isCorrect: true, comment: "Exact, la rigidité constante du matelas est essentielle pour une immobilisation efficace." },
              { text: "Garantir le confort maximal de la victime pendant l'immobilisation.", isCorrect: false, comment: "Le confort n'est pas la principale préoccupation de l'immobilisation, la sécurité l'est." },
              { text: "Adapter la position de la victime en fonction de sa détresse respiratoire.", isCorrect: false, comment: "L'immobilisation vise à maintenir la position correcte, pas à s'adapter à la détresse respiratoire." }
            ]
        },
        {
            text: "Quand est-il recommandé de maintenir la tête du blessé en position neutre ?",
            answers: [
              { text: "Dès qu'un traumatisme de la tête, de la nuque ou du dos de la victime est suspecté.", isCorrect: true, comment: "Exact, le maintien de la tête en position neutre est indiqué en cas de suspicion de traumatisme de la tête, de la nuque ou du dos." },
              { text: "Uniquement lorsqu'il y a une immobilisation complète de l'axe tête-cou-tronc.", isCorrect: false, comment: "Le maintien en position neutre peut être effectué en attente d'une immobilisation complète, mais il est recommandé dès la suspicion de traumatisme." },
              { text: "Après avoir procédé à une évaluation primaire de la victime.", isCorrect: false, comment: "Le maintien en position neutre est recommandé dès la suspicion de traumatisme, avant une évaluation complète." },
              { text: "Lorsque la victime est consciente et coopérante.", isCorrect: false, comment: "Le maintien en position neutre est indiqué dès la suspicion de traumatisme, indépendamment de la coopération de la victime." }
            ]
        },
        {
            text: "Quel est l'objectif principal du maintien de la tête en position neutre ?",
            answers: [              { text: "Assurer le confort de la victime pendant l'intervention.", isCorrect: false, comment: "Le maintien en position neutre est prioritaire pour la sécurité et la prévention de complications." },
              { text: "Limiter les mouvements du cou et stabiliser le rachis cervical en attente d'une immobilisation complète.", isCorrect: true, comment: "Exact, le maintien en position neutre vise à limiter les mouvements du cou et à stabiliser le rachis cervical en cas de suspicion de traumatisme." },
              { text: "Faciliter le transport de la victime vers un centre médical.", isCorrect: false, comment: "Le maintien en position neutre est essentiel pour la stabilisation initiale en attendant une évaluation et une immobilisation adéquates." },
              { text: "Réduire la douleur cervicale de la victime.", isCorrect: false, comment: "Le maintien en position neutre n'est pas destiné à réduire la douleur mais à limiter les mouvements du cou pour prévenir les lésions." },

            ]
        },
        {
            text: "Que doit faire le secouriste si la tête de la victime n'est pas alignée avec le tronc ?",
            answers: [
              { text: "Replacer délicatement la tête dans l'axe du tronc sans exercer de traction jusqu'à ce que la victime regarde droit devant.", isCorrect: true, comment: "Exact, il est important de replacer la tête de manière délicate pour éviter toute traction excessive." },
              { text: "Exercer une légère traction pour aligner la tête avec le tronc.", isCorrect: false, comment: "Il ne faut pas exercer de traction sur la tête lors du repli dans l'axe du tronc." },
              { text: "Demander à la victime de bouger la tête pour l'aligner avec le tronc.", isCorrect: false, comment: "Le secouriste doit effectuer le repositionnement de la tête sans demander à la victime de bouger." },
              { text: "Immobiliser la tête dans sa position actuelle jusqu'à l'arrivée de renforts.", isCorrect: false, comment: "Il est préférable de replacer délicatement la tête dans l'axe du tronc si elle n'est pas alignée." }
            ]
        },
        {
            text: "Quand peut-on interrompre le maintien de la tête en position neutre ?",
            answers: [
              { text: "Après avoir demandé à la victime de ne pas bouger la tête et si elle est allongée à plat dos, calme et coopérante.", isCorrect: true, comment: "Exact, le maintien peut être interrompu si la victime est stable, consciente et coopérante." },
              { text: "Uniquement après une immobilisation complète du rachis cervical.", isCorrect: false, comment: "Le maintien peut être interrompu en fonction de l'état de la victime, pas seulement après l'immobilisation complète." },
              { text: "Après une évaluation complète de la victime par les secouristes.", isCorrect: false, comment: "La décision d'interrompre le maintien dépend de l'état de la victime et de sa coopération, pas seulement d'une évaluation complète." },
              { text: "Lorsque la victime signale une amélioration de ses symptômes.", isCorrect: false, comment: "L'interruption du maintien dépend de l'évaluation de la stabilité de la victime, pas seulement des symptômes." }
            ]
        },
        {
            text: "Comment le secouriste doit-il se positionner pour maintenir la tête en position neutre ?",
            answers: [

              { text: "Debout à côté de la victime.", isCorrect: false, comment: "Le secouriste doit se placer à genoux pour maintenir la tête en position neutre, pas debout à côté de la victime." },
              { text: "Assis au niveau des pieds de la victime.", isCorrect: false, comment: "Le secouriste doit se positionner au niveau de la tête de la victime pour maintenir la tête en position neutre." },
              { text: "À genoux derrière la victime.", isCorrect: false, comment: "Il est recommandé de se placer à genoux dans l'axe de la victime, à la tête, pour maintenir la tête en position neutre." },  
              { text: "À genoux dans l'axe de la victime, à la tête.", isCorrect: true, comment: "Exact, le secouriste doit se placer à genoux dans l'axe de la victime, au niveau de la tête, pour maintenir la tête en position neutre." },
            ]
        },
        {
            text: "Pendant combien de temps le maintien de la tête en position neutre est-il généralement maintenu ?",
            answers: [
              { text: "Jusqu'à l'immobilisation complète du rachis cervical.", isCorrect: true, comment: "Exact, le maintien de la tête en position neutre est maintenu en attente de l'immobilisation complète du rachis cervical." },
              { text: "Durant toute la durée de l'intervention des secouristes.", isCorrect: false, comment: "Le maintien de la tête en position neutre n'est maintenu que jusqu'à ce que l'immobilisation du rachis cervical soit réalisée." },
              { text: "Jusqu'à ce que la victime soit transportée vers un centre médical.", isCorrect: false, comment: "Le maintien de la tête en position neutre est maintenu jusqu'à ce que l'immobilisation du rachis cervical soit réalisée, pas seulement pendant le transport." },
              { text: "Pendant toute la durée de l'évaluation initiale de la victime.", isCorrect: false, comment: "Le maintien de la tête en position neutre est maintenu en attente de l'immobilisation du rachis cervical, pas seulement pendant l'évaluation initiale." }
            ]
        },
        {
            text: "Que doit faire le secouriste si la tête de la victime résiste au déplacement pour la replacer en position neutre ?",
            answers: [
              { text: "Interrompre immédiatement la manœuvre et maintenir la tête dans sa position actuelle en attendant un renfort.", isCorrect: true, comment: "Exact, le secouriste doit cesser la manœuvre si la tête résiste au déplacement, pour éviter d'aggraver les lésions." },
              { text: "Appliquer une traction progressive sur la tête pour la replacer en position neutre.", isCorrect: false, comment: "Il ne faut pas appliquer de traction sur la tête en cas de résistance au déplacement." },
              { text: "Demander à la victime de bouger la tête pour faciliter le déplacement.", isCorrect: false, comment: "La tête doit être replacée délicatement sans demander de mouvement actif à la victime." },
              { text: "Maintenir la tête dans sa position actuelle jusqu'à l'immobilisation complète du rachis cervical.", isCorrect: false, comment: "Il est préférable de cesser la manœuvre en cas de résistance pour éviter les complications." }
            ]
        },
        {
            text: "Quels symptômes doivent alerter le secouriste lors du maintien de la tête en position neutre ?",
            answers: [
              { text: "Une résistance au déplacement de la tête, une douleur cervicale accrue ou des sensations anormales dans les membres.", isCorrect: true, comment: "Exact, ces symptômes indiquent qu'il faut cesser la manœuvre et maintenir la tête dans sa position actuelle." },
              { text: "Une sensation de fatigue dans les bras du secouriste.", isCorrect: false, comment: "Les symptômes liés à la victime, comme la résistance au déplacement de la tête, sont plus critiques pour l'évaluation." },
              { text: "Une perte de sensibilité au niveau du cou de la victime.", isCorrect: false, comment: "Les sensations anormales dans les membres sont plus critiques pour l'évaluation de la stabilité du cou." },
              { text: "Une augmentation de la fréquence cardiaque de la victime.", isCorrect: false, comment: "Les symptômes concernant la tête et le cou de la victime sont plus critiques pour l'évaluation initiale." }
            ]
        },
        {
            text: "Quelle est la principale précaution à prendre lors du maintien de la tête en position neutre ?",
            answers: [              { text: "Appliquer une traction progressive sur la tête en cas de résistance.", isCorrect: false, comment: "Il ne faut pas appliquer de traction sur la tête en cas de résistance." },
              { text: "Demander à la victime de bouger la tête pour vérifier la stabilité du cou.", isCorrect: false, comment: "La tête doit être replacée délicatement sans demander de mouvement actif à la victime." },
              { text: "Cesser immédiatement la manœuvre en cas de résistance, de douleur accrue ou de sensations anormales.", isCorrect: true, comment: "Exact, il est essentiel de prendre des précautions pour éviter d'aggraver les lésions cervicales." },
              { text: "Maintenir la position jusqu'à ce que la victime signale une amélioration de ses symptômes.", isCorrect: false, comment: "Les signes de la victime doivent alerter le secouriste pour cesser la manœuvre, pas seulement son signalement." },

            ]
        },
        {
            text: "Quel est l'objectif principal du maintien de la tête en position neutre pour un secouriste ?",
            answers: [
              { text: "Prévenir les mouvements du cou et stabiliser le rachis cervical en attente d'une immobilisation complète.", isCorrect: true, comment: "Exact, le maintien en position neutre vise à stabiliser le cou pour éviter les lésions avant l'immobilisation complète." },
              { text: "Soutenir la tête de la victime pour lui éviter une gêne respiratoire.", isCorrect: false, comment: "Le maintien en position neutre est principalement pour la stabilisation du cou et la prévention des lésions." },
              { text: "Empêcher la victime de bouger pendant l'intervention des secouristes.", isCorrect: false, comment: "Le maintien en position neutre est pour la sécurité du cou de la victime, pas seulement pour empêcher les mouvements." },
              { text: "Réduire la douleur cervicale de la victime.", isCorrect: false, comment: "Le maintien en position neutre n'est pas destiné à réduire la douleur mais à prévenir les complications du cou." }
            ]
        },
        {
            text: "Que doit faire le secouriste si la victime est debout ou assise lors du maintien de la tête en position neutre ?",
            answers: [
              { text: "Replacer délicatement la tête dans l'axe du tronc en soulageant le rachis cervical du poids de la tête.", isCorrect: true, comment: "Exact, le secouriste doit soutenir la tête et replacer délicatement la tête dans l'axe du tronc." },
              { text: "Demander à la victime de s'allonger immédiatement sur le dos.", isCorrect: false, comment: "Il n'est pas nécessaire de demander un changement de position, mais de replacer délicatement la tête." },
              { text: "Demander à la victime de bouger la tête pour vérifier la mobilité du cou.", isCorrect: false, comment: "La tête doit être replacée en position neutre sans demander de mouvement actif à la victime." },
              { text: "Appliquer une immobilisation du rachis cervical immédiatement.", isCorrect: false, comment: "Le maintien en position neutre est une étape préliminaire avant toute immobilisation du rachis cervical." }
            ]
        },
        {
            text: "Quel geste doit faire le secouriste si la tête de la victime résiste au déplacement lors du maintien en position neutre ?",
            answers: [
              { text: "Interrompre immédiatement la manœuvre et maintenir la tête dans sa position actuelle en attendant un renfort.", isCorrect: true, comment: "Exact, le secouriste doit cesser la manœuvre si la tête résiste au déplacement, pour éviter d'aggraver les lésions." },
              { text: "Appliquer une traction progressive sur la tête pour la replacer en position neutre.", isCorrect: false, comment: "Il ne faut pas appliquer de traction sur la tête en cas de résistance au déplacement." },
              { text: "Demander à la victime de bouger la tête pour faciliter le déplacement.", isCorrect: false, comment: "La tête doit être replacée délicatement sans demander de mouvement actif à la victime." },
              { text: "Maintenir la tête dans sa position actuelle jusqu'à l'immobilisation complète du rachis cervical.", isCorrect: false, comment: "Il est préférable de cesser la manœuvre en cas de résistance pour éviter les complications." }
            ]
        },
        {
            text: "Quel est l'objectif principal de l'attelle cervico-thoracique (ACT) ?",
            answers: [
                { text: "Providing support to the lower back of a victim during transportation.", isCorrect: false, comment: "This is not the primary purpose of the ACT in managing suspected spinal injuries." },
                { text: "Immobiliser la tête, la nuque et le dos d'une victime suspectée de traumatisme de la colonne vertébrale pour faciliter son dégagement ou son extraction.", isCorrect: true, comment: "Exact, l'ACT est utilisée pour immobiliser ces parties du corps lors d'une extraction ou d'un dégagement." },
                { text: "Restricting movement of the upper limbs in case of suspected spinal injury.", isCorrect: false, comment: "This answer is incorrect as it doesn't address the primary purpose of the ACT in spinal injury scenarios." },
                { text: "Promoting mobility and comfort for a victim with suspected spinal trauma.", isCorrect: false, comment: "The ACT is primarily for immobilization, not mobility, in suspected spinal injuries." }
            ]
        },
        {
            text: "Combien de sangles thoraciques sont utilisées pour attacher l'attelle cervico-thoracique ?",
            answers: [
                { text: "Deux.", isCorrect: false, comment: "The correct number of thoracic straps used is three." },
                { text: "Quatre.", isCorrect: false, comment: "The correct number of thoracic straps used is three." },
                { text: "Cinq.", isCorrect: false, comment: "The correct number of thoracic straps used is three." },
                { text: "Trois.", isCorrect: true, comment: "Correct, three thoracic straps are used to secure the cervico-thoracic splint." }
            ]
        },
        {
            text: "Quelles parties du corps sont immobilisées par l'attelle cervico-thoracique ?",
            answers: [
                { text: "Les membres supérieurs et le bassin.", isCorrect: false, comment: "The ACT primarily immobilizes the upper body, not the limbs or pelvis." },
                { text: "Les membres inférieurs et le bassin.", isCorrect: false, comment: "The ACT primarily immobilizes the upper body, not the lower limbs or pelvis." },
                { text: "La tête, la nuque et le dos.", isCorrect: true, comment: "Correct, the ACT immobilizes the head, neck, and back of the victim." },
                { text: "Le cou et les épaules.", isCorrect: false, comment: "The ACT immobilizes the head, neck, and back, not just the neck and shoulders." }
            ]
        },
        {
            text: "Pourquoi l'attelle cervico-thoracique (ACT) est-elle retirée avant le transport de la victime vers l'hôpital ?",
            answers: [
                { text: "Pour faciliter l'examen du rachis cervical en chemin.", isCorrect: false, comment: "The ACT is primarily removed to prevent respiratory issues, not for cervical spine examination during transport." },
                { text: "Pour ajuster les sangles thoraciques avant le transport.", isCorrect: false, comment: "Adjustments to thoracic straps are not the primary reason for removing the ACT." },
                { text: "Pour éviter les risques secondaires tels que les difficultés respiratoires.", isCorrect: true, comment: "Correct, removing the ACT helps prevent complications like breathing difficulties." },
                { text: "Pour permettre une meilleure mobilité de la victime pendant le transport.", isCorrect: false, comment: "The removal of the ACT is primarily for patient safety and respiratory concerns, not mobility." }
            ]
        },
        {
            text: "Quelle est la première étape après avoir placé un collier cervical avant de mettre en place l'attelle cervico-thoracique ?",
            answers: [
                { text: "Contrôler la motricité et la sensibilité de l'extrémité de chaque membre.", isCorrect: true, comment: "Correct, limb motor and sensory assessment is a crucial step before applying the cervico-thoracic splint." },
                { text: "Demander à la victime de s'asseoir confortablement.", isCorrect: false, comment: "Assessing limb function is essential before applying the ACT, rather than asking the victim to sit." },
                { text: "Installer l'attelle cervico-thoracique immédiatement.", isCorrect: false, comment: "Limb assessment is necessary before proceeding with the application of the cervico-thoracic splint." },
                { text: "S'assurer de la position de la victime sur le brancard.", isCorrect: false, comment: "Limb assessment is a critical step before applying the ACT, not related to positioning on the stretcher." }
            ]
        },
        {
            text: "Quelle est la raison pour laquelle on évite de comprimer le thorax lors de la mise en place de l'attelle cervico-thoracique ?",
            answers: [
                { text: "Pour ne pas aggraver une détresse respiratoire.", isCorrect: true, comment: "Correct, avoiding thoracic compression helps prevent respiratory distress during ACT application." },
                { text: "Pour maintenir la victime dans une position confortable.", isCorrect: false, comment: "The primary concern is respiratory function, not just comfort, during ACT application." },
                { text: "Pour faciliter l'extraction de la victime.", isCorrect: false, comment: "Respiratory compromise is the main concern, rather than ease of extraction." },
                { text: "Pour assurer une immobilisation complète de la colonne vertébrale.", isCorrect: false, comment: "Thoracic compression is avoided primarily to prevent respiratory issues, not for spinal immobilization." }
            ]
        },
        {
            text: "Quelle est la dernière étape avant d'effectuer l'extraction de la victime après avoir posé l'attelle cervico-thoracique ?",
            answers: [
                { text: "Contrôler la motricité et la sensibilité de l'extrémité de chaque membre.", isCorrect: true, comment: "Correct, limb function assessment is the final step before extracting the victim." },
                { text: "Ajuster les sangles thoraciques.", isCorrect: false, comment: "The last step is not adjusting thoracic straps but assessing limb function." },
                { text: "S'assurer que la victime est confortable.", isCorrect: false, comment: "Limb function assessment is crucial before extraction, regardless of comfort." },
                { text: "Communiquer avec l'équipe médicale pour le transport.", isCorrect: false, comment: "Final steps involve ensuring limb function before transportation, not direct communication with medical personnel." }
            ]
        },
        {
            text: "Quelle est la précaution à prendre lors de l'installation de l'attelle cervico-thoracique chez une femme enceinte pendant les derniers mois de grossesse ?",
            answers: [
                { text: "Ne pas serrer la sangle thoracique inférieure sur l'abdomen.", isCorrect: true, comment: "Correct, avoiding tightness of the lower thoracic strap over the abdomen is essential in late pregnancy." },
                { text: "Éviter de mettre en place l'attelle cervico-thoracique.", isCorrect: false, comment: "Precautions such as proper strap adjustment are key, rather than avoiding the ACT altogether." },
                { text: "Croiser les sangles thoraciques pour un meilleur maintien.", isCorrect: false, comment: "Avoiding tightness of the lower thoracic strap over the abdomen is crucial, not crossing thoracic straps." },
                { text: "Renforcer les fixations de l'attelle cervico-thoracique.", isCorrect: false, comment: "The precaution involves proper strap adjustment, not reinforcing ACT attachments." }
            ]
        },
        {
            text: "Pourquoi est-il nécessaire de maintenir les bandes de chaque côté de la tête par les deux sangles de l'attelle cervico-thoracique ?",
            answers: [
                { text: "Pour stabiliser la tête et assurer son alignement avec le cou et le tronc.", isCorrect: true, comment: "Correct, securing the head bands with the straps stabilizes the head in alignment with the neck and trunk." },
                { text: "Pour immobiliser les épaules de la victime.", isCorrect: false, comment: "Securing the head bands is primarily for head stabilization, not shoulder immobilization." },
                { text: "Pour faciliter le déplacement de la victime.", isCorrect: false, comment: "The purpose of securing head bands is stability, not mobility, during movement." },
                { text: "Pour réduire la douleur cervicale de la victime.", isCorrect: false, comment: "Head stabilization helps maintain alignment, not necessarily reduce neck pain." }
            ]
        },
        {
            text: "Quelle est la raison principale pour retirer l'attelle cervico-thoracique une fois la victime sur le Matelas Immobilisateur à Dépression (MID ?",
            answers: [
                { text: "Pour effectuer un examen complet de la colonne vertébrale.", isCorrect: false, comment: "Respiratory concerns are the primary reason for ACT removal, not solely for spinal examination." },
                { text: "Pour éviter les risques de difficultés respiratoires pendant le transport.", isCorrect: true, comment: "Correct, removing the ACT helps prevent respiratory issues during transport on the MID." },
                { text: "Pour faciliter la manipulation de la victime.", isCorrect: false, comment: "The removal of the ACT is primarily for patient safety, not ease of handling." },
                { text: "Pour ajuster les fixations du Matelas Immobilisateur à Dépression (MID).", isCorrect: false, comment: "The ACT is removed to prevent respiratory complications, not for MID adjustments." }
            ]
        },
        {
            text: "Quel est le rôle des poignées de portage sur l'attelle cervico-thoracique ?",
            answers: [
                { text: "Permettre le déplacement de la victime avec l'ACT et les secouristes.", isCorrect: true, comment: "Correct, the carrying handles assist in moving the victim along with the ACT and rescuers." },
                { text: "Assurer l'immobilisation de la tête de la victime.", isCorrect: false, comment: "The primary function of the handles is for mobility during transport, not head immobilization." },
                { text: "Contrôler la sensibilité des membres inférieurs.", isCorrect: false, comment: "Carrying handles aid in patient movement rather than limb assessment." },
                { text: "Stabiliser la colonne vertébrale de la victime.", isCorrect: false, comment: "The handles assist in patient transport, not spinal stabilization." }
            ]
        },
        {
            text: "Quand doit-on installer un collier cervical chez une victime suspectée de traumatisme du rachis ?",
            answers: [
                { text: "Avant une manœuvre de mobilisation de la victime, si la stabilisation manuelle du rachis est difficile ou aléatoire.", isCorrect: true, comment: "Correct, the cervical collar is applied before attempting to mobilize the victim's spine if manual stabilization is challenging." },
                { text: "Après avoir déplacé la victime sur un brancard.", isCorrect: false, comment: "The cervical collar is applied before moving the victim onto a stretcher, not after." },
                { text: "En dernier recours après avoir mobilisé la victime.", isCorrect: false, comment: "The cervical collar is applied before attempting any victim mobilization, not as a last resort." },
                { text: "Uniquement si la victime est allongée sur le ventre.", isCorrect: false, comment: "The cervical collar is applied in various positions depending on the situation, not only when the victim is lying on their stomach." }
            ]
        },
        {
            text: "Quelle est la contre-indication à l'utilisation d'un collier cervical ?",
            answers: [
                { text: "Une possible obstruction des voies aériennes.", isCorrect: true, comment: "Correct, cervical collar use is contraindicated if there is a risk of airway obstruction." },
                { text: "Une fracture du membre inférieur.", isCorrect: false, comment: "An airway issue, not a lower limb fracture, is a contraindication for cervical collar use." },
                { text: "Une déformation du rachis thoracique.", isCorrect: false, comment: "Cervical collar use is contraindicated primarily for airway concerns, not specific spinal deformities." },
                { text: "Une lésion de la peau au niveau du cou.", isCorrect: false, comment: "Airway issues are the main concern for contraindicating cervical collar use, not skin lesions." }
            ]
        },
        {
            text: "Quel est le rôle du secouriste 1 lors de la mise en place d'un collier cervical sur une victime allongée sur le dos ?",
            answers: [
                { text: "Maintenir la tête en position neutre pendant toute la manœuvre.", isCorrect: true, comment: "Correct, the primary role of the first rescuer is to maintain the victim's head in a neutral position throughout the procedure." },
                { text: "S'assurer que la victime respire normalement.", isCorrect: false, comment: "Head stabilization is the primary role during cervical collar application, not respiratory assessment." },
                { text: "Préparer le matériel nécessaire.", isCorrect: false, comment: "Head stabilization is the primary role during cervical collar application, not material preparation." },
                { text: "Choisir le collier cervical adapté.", isCorrect: false, comment: "The first rescuer's role is head stabilization, not collar selection." }
            ]
        },
        {
            text: "Quelle est la méthode pour choisir la bonne hauteur du collier cervical ?",
            answers: [
                { text: "La hauteur du collier doit être égale à la distance entre le menton et le haut du sternum de la victime.", isCorrect: true, comment: "Correct, the collar height should match the distance from the chin to the top of the sternum." },
                { text: "La hauteur du collier doit être ajustée selon l'avis du secouriste 2.", isCorrect: false, comment: "The collar height is determined by the anatomical distance, not solely based on rescuer judgment." },
                { text: "Le collier cervical doit être placé au niveau des épaules de la victime.", isCorrect: false, comment: "Collar height is based on chin-to-sternum distance, not shoulder level." },
                { text: "La hauteur du collier doit être au niveau des oreilles de la victime.", isCorrect: false, comment: "Collar height is based on chin-to-sternum distance, not ear level." }
            ]
        },
        {
            text: "Qu'est-ce que le secouriste doit faire si le collier cervical gêne la respiration de la victime ?",
            answers: [

                { text: "Retirer immédiatement le collier cervical.", isCorrect: false, comment: "Repositioning is preferred over immediate removal if the collar causes respiratory issues." },
                { text: "Resserrer les sangles du collier cervical.", isCorrect: false, comment: "Loosening the collar or adjusting its position is preferred over tightening if there is airway obstruction." },
                { text: "Maintenir la tête en position neutre.", isCorrect: false, comment: "Adjustment of the collar is the primary action if there's a breathing problem." },
                                { text: "Réajuster le collier cervical pour libérer les voies aériennes.", isCorrect: true, comment: "Correct, if the collar obstructs breathing, readjust it to ensure airway patency." },
            ]
        },
        {
            text: "Quel est le rôle des bandes autoagrippantes sur un collier cervical ?",
            answers: [
                { text: "Maintenir la tête en position neutre.", isCorrect: false, comment: "The primary role of the fasteners is collar fixation, not head stabilization." },
                { text: "Contrôler la motricité des membres de la victime.", isCorrect: false, comment: "Fasteners are for collar stability, not limb assessment." },
                { text: "Assurer la fixation du collier autour du cou de la victime.", isCorrect: true, comment: "Correct, the hook-and-loop fasteners secure the collar around the victim's neck." },
                { text: "Réajuster la taille du collier cervical.", isCorrect: false, comment: "Fasteners secure the collar in place; they do not adjust its size." }
            ]
        },
        {
            text: "Quelle action doit être prise si la victime présente une déformation préexistante du rachis cervical ?",
            answers: [
                { text: "Installer un collier cervical plus large pour stabiliser le rachis.", isCorrect: false, comment: "Maintaining the current head position is advised for pre-existing deformities, not collar adjustment." },
                { text: "Effectuer une manipulation de la tête pour corriger la déformation.", isCorrect: false, comment: "Manual manipulation is not recommended for pre-existing cervical spine deformities." },
                { text: "Appliquer une traction cervicale douce pour réaligner la colonne vertébrale.", isCorrect: false, comment: "No manipulation or traction should be performed on pre-existing spinal deformities." },
                { text: "Maintenir la tête dans la position où elle se trouve.", isCorrect: true, comment: "Correct, if the victim has a pre-existing cervical spine deformity, the head should be maintained in its current position." },
            ]
        },
        {
            text: "Quel est le rôle du collier cervical lors de la mobilisation d'une victime suspectée de lésion du rachis cervical ?",
            answers: [
                { text: "Limiter les mouvements du rachis cervical pour réduire le risque de lésion médullaire.", isCorrect: true, comment: "Correct, the cervical collar restricts cervical spine movements to minimize the risk of spinal cord injury during mobilization." },
                { text: "Maintenir la victime dans une position confortable.", isCorrect: false, comment: "The collar's primary role is to limit spine movements, not solely to ensure comfort." },
                { text: "Stabiliser la région lombaire de la victime.", isCorrect: false, comment: "The collar targets cervical spine stability, not lumbar stabilization." },
                { text: "Faciliter la mobilisation des membres de la victime.", isCorrect: false, comment: "Cervical collar use is primarily for cervical spine protection, not limb mobilization." }
            ]
        },
        {
            text: "Quand est-il recommandé de retirer le collier cervical chez une victime ?",
            answers: [
                { text: "Une fois la victime stabilisée sur un brancard de relevage.", isCorrect: false, comment: "Collar removal is recommended before hospital transport, not after stabilizing on a stretcher." },
                { text: "Après avoir réévalué la motricité des membres de la victime.", isCorrect: false, comment: "Collar removal is primarily based on respiratory considerations, not limb assessments." },
                { text: "Avant le transport de la victime vers l'hôpital pour éviter les complications respiratoires.", isCorrect: true, comment: "Correct, the collar should be removed before hospital transport to prevent respiratory complications." },
                { text: "Lorsque la victime se sent prête à se déplacer.", isCorrect: false, comment: "Collar removal is based on medical assessment, not the victim's comfort level." }
            ]
        },
        {
            text: "Quelle est la principale complication liée à l'utilisation prolongée d'un collier cervical ?",
            answers: [
                { text: "Des difficultés respiratoires.", isCorrect: true, comment: "Correct, prolonged cervical collar use may lead to respiratory issues due to restricted chest movement." },
                { text: "Des douleurs cervicales.", isCorrect: false, comment: "Respiratory complications are the main concern with prolonged collar use, not neck pain." },
                { text: "Une instabilité de la colonne vertébrale.", isCorrect: false, comment: "Respiratory issues are the primary concern, not spinal instability." },
                { text: "Une perte de sensibilité au niveau des membres.", isCorrect: false, comment: "Respiratory complications are the primary concern with prolonged collar use, not sensory deficits." }
            ]
        }, 
        {
            text: "Quelle est la démarche à suivre pour réaligner une jambe fracturée fermée ?",
            answers: [
                { text: "Saisir la cheville avec les deux mains et ramener progressivement la jambe dans l'axe normal du membre inférieur en exerçant une traction douce.", isCorrect: true, comment: "Correct, the leg should be gently pulled back into alignment after grasping the ankle with both hands." },
                { text: "Demander à la victime de se déplacer pour réaligner sa jambe.", isCorrect: false, comment: "Direct manual realignment is required, not passive movement by the victim." },
                { text: "Appliquer un bandage compressif autour de la jambe.", isCorrect: false, comment: "Realignment involves manual manipulation to restore alignment, not compression bandaging." },
                { text: "Appliquer une attelle rigide sans manipulation directe.", isCorrect: false, comment: "Direct realignment is necessary before applying immobilization devices." }
            ]
        },
        {
            text: "Quand le réalignement d'un membre doit-il être interrompu immédiatement?",
            answers: [
                { text: "En cas de résistance au réalignement ou si la douleur de la victime devient intolérable.", isCorrect: true, comment: "Correct, realignment should be stopped immediately if there is resistance or intolerable pain." },
                { text: "Après avoir immobilisé le membre réaligné.", isCorrect: false, comment: "Immediate cessation may be necessary if there are difficulties during realignment, regardless of subsequent immobilization." },
                { text: "Après l'apparition de signes de déformation.", isCorrect: false, comment: "Interruption should occur based on realignment difficulties or pain, not solely on deformity." },
                { text: "Une fois que la victime est immobilisée.", isCorrect: false, comment: "Interruption is based on realignment process and tolerance, not solely on final immobilization." }
            ]
        },
        {
            text: "Que doit faire le secouriste après avoir réaligné un membre fracturé fermé ?",
            answers: [
                { text: "Immobiliser le membre avec un dispositif d'immobilisation spécifique et surveiller l'atténuation de la douleur et des signes de complications.", isCorrect: true, comment: "Correct, immobilization with a specific device and monitoring for pain relief and complication signs are essential post-realignment steps." },
                { text: "Administrer des analgésiques à la victime.", isCorrect: false, comment: "Post-realignment care involves immobilization and assessment, not just pain management." },
                { text: "Demander à la victime de se déplacer pour tester le membre réaligné.", isCorrect: false, comment: "Post-realignment care focuses on proper immobilization and monitoring, not movement testing by the victim." },
                { text: "Appliquer une attelle rigide sans surveillance.", isCorrect: false, comment: "Immobilization and careful monitoring are necessary post-realignment, not just applying a rigid splint." }
            ]
        },
        {
            text: "Pourquoi le réalignement d'un membre fracturé fermé peut-il être réalisé par un secouriste en l'absence de médecin ?",
            answers: [
                { text: "En cas de signes de complications vasculaires ou neurologiques, ou si la déformation empêche la mise en place d'un dispositif d'immobilisation.", isCorrect: true, comment: "Correct, realignment is indicated in the absence of a physician if there are signs of vascular or neurological complications, or if deformity obstructs immobilization." },
                { text: "Uniquement après avis médical direct.", isCorrect: false, comment: "In certain emergency situations, realignment may be necessary even without direct medical supervision based on specific indications." },
                { text: "Pour soulager immédiatement la douleur de la victime.", isCorrect: false, comment: "Realignment is primarily based on functional necessity and complication prevention, not just pain relief." },
                { text: "Dans le but de fixer le membre avec un dispositif d'immobilisation.", isCorrect: false, comment: "Realignment is done to address specific complications or immobilization challenges, not solely to apply an immobilization device." }
            ]
        },
        {
            text: "Quelle est la principale justification du réalignement d'un membre ?",
            answers: [
                { text: "Prévenir les complications vasculaires ou nerveuses et permettre la mise en place d'un dispositif d'immobilisation.", isCorrect: true, comment: "Correct, realignment aims to prevent vascular or neurological complications and facilitate proper immobilization." },
                { text: "Soulager immédiatement la douleur de la victime.", isCorrect: false, comment: "Realignment is primarily based on functional necessity and complication prevention, not just pain relief." },
                { text: "Fixer le membre avec un dispositif d'immobilisation.", isCorrect: false, comment: "Realignment is done to address specific complications or immobilization challenges, not solely to apply an immobilization device." },
                { text: "Assurer le confort de la victime pendant l'intervention.", isCorrect: false, comment: "Realignment aims to prevent complications and facilitate proper care, not solely for comfort." }
            ]
        },
        {
            text: "Que doit faire le secouriste pour réaligner un avant-bras fracturé fermé ?",
            answers: [             { text: "Appliquer un bandage compressif autour du membre.", isCorrect: false, comment: "Realignment involves manual manipulation to restore alignment, not compression bandaging." },
                { text: "Saisir le coude de la victime avec une main et le poignet ou la main avec l'autre main, puis ramener progressivement l'avant-bras dans l'axe normal en exerçant une traction douce.", isCorrect: true, comment: "Correct, the forearm should be gently pulled back into alignment after securing the elbow and wrist." },
                { text: "Demander à la victime de bouger l'avant-bras pour le réaligner.", isCorrect: false, comment: "Direct manual realignment is required, not passive movement by the victim." },
                { text: "Appliquer une attelle rigide sans manipulation directe.", isCorrect: false, comment: "Direct realignment is necessary before applying immobilization devices." }
            ]
        },
        {
            text: "Que doit faire le secouriste pour réaligner un avant-bras fracturé fermé ?",
            answers: [
                { text: "Saisir le coude de la victime avec une main et le poignet ou la main avec l'autre main, puis ramener progressivement l'avant-bras dans l'axe normal en exerçant une traction douce.", isCorrect: true, comment: "Correct, the forearm should be gently pulled back into alignment after securing the elbow and wrist." },
                { text: "Demander à la victime de bouger l'avant-bras pour le réaligner.", isCorrect: false, comment: "Direct manual realignment is required, not passive movement by the victim." },
                { text: "Appliquer un bandage compressif autour du membre.", isCorrect: false, comment: "Realignment involves manual manipulation to restore alignment, not compression bandaging." },
                { text: "Appliquer une attelle rigide sans manipulation directe.", isCorrect: false, comment: "Direct realignment is necessary before applying immobilization devices." }
            ]
        },
        {
            text: "Quels signes peuvent indiquer la nécessité d'un réalignement d'un membre fracturé fermé  ?",
            answers: [
                { text: "Complications vasculaires ou neurologiques, ou impossibilité de mettre en place un dispositif d'immobilisation.", isCorrect: true, comment: "Correct, signs include vascular or neurological complications, or challenges with immobilization device placement." },
                { text: "Douleur mineure dans le membre fracturé.", isCorrect: false, comment: "Indications for realignment are primarily based on functional and medical necessity, not solely on pain assessment." },
                { text: "Présence de décoloration cutanée au niveau de la fracture.", isCorrect: false, comment: "Realignment considerations are based on vascular or neurological concerns, not skin discoloration." },
                { text: "Disponibilité limitée de dispositifs d'immobilisation.", isCorrect: false, comment: "Indications for realignment are based on functional and medical necessity, not resource limitations." }
            ]
        },
        {
            text: "Quand doit-on interrompre immédiatement le réalignement d'un membre?",
            answers: [
                { text: "En cas de résistance au réalignement ou si la douleur de la victime devient intolérable.", isCorrect: true, comment: "Correct, realignment should be stopped immediately if there is resistance or intolerable pain." },
                { text: "Après avoir immobilisé le membre réaligné.", isCorrect: false, comment: "Immediate cessation may be necessary if there are difficulties during realignment, regardless of subsequent immobilization." },
                { text: "Après l'apparition de signes de déformation.", isCorrect: false, comment: "Interruption should occur based on realignment difficulties or pain, not solely on deformity." },
                { text: "Une fois que la victime est immobilisée.", isCorrect: false, comment: "Interruption is based on realignment process and tolerance, not solely on final immobilization." }
            ]
        },
        {
            text: "Quelle est la principale justification du réalignement d'un membre ?",
            answers: [
                { text: "Soulager immédiatement la douleur de la victime.", isCorrect: false, comment: "Realignment is primarily based on functional necessity and complication prevention, not just pain relief." },
                { text: "Prévenir les complications vasculaires ou nerveuses et permettre la mise en place d'un dispositif d'immobilisation.", isCorrect: true, comment: "Correct, realignment aims to prevent vascular or neurological complications and facilitate proper immobilization." },
                { text: "Fixer le membre avec un dispositif d'immobilisation.", isCorrect: false, comment: "Realignment is done to address specific complications or immobilization challenges, not solely to apply an immobilization device." },
                { text: "Assurer le confort de la victime pendant l'intervention.", isCorrect: false, comment: "Realignment aims to prevent complications and facilitate proper care, not solely for comfort." }
            ]
        },
        {
            text: "Quel est le critère pour interrompre immédiatement le réalignement d'un membre ?",
            answers: [
                { text: "Résistance au réalignement ou douleur intolérable pour la victime.", isCorrect: true, comment: "Correct, realignment should be immediately stopped if there is resistance or if the victim experiences intolerable pain." },
                { text: "Absence de résultats visibles.", isCorrect: false, comment: "Interruption should be based on functional difficulties or pain tolerance, not solely on immediate results." },
                { text: "Nouvelle évaluation de la déformation.", isCorrect: false, comment: "Immediate interruption is based on realignment process and functional necessity, not just on re-evaluation of the deformity." },
                { text: "Arrivée d'un médecin sur les lieux.", isCorrect: false, comment: "Immediate cessation may be required based on patient discomfort or realignment challenges, not solely on physician presence." }
            ]
        },
        {
            text: "Quand est-il indiqué de retirer le casque de protection d'une victime en présence de deux secouristes ?",
            answers: [
                { text: "Dans tous les cas.", isCorrect: true, comment: "Correct, le retrait du casque est indiqué dans tous les cas lorsqu'au moins deux secouristes sont présents." },
                { text: "Uniquement si la victime a perdu connaissance.", isCorrect: false, comment: "Le retrait est indiqué dans tous les cas lorsqu'au moins deux secouristes sont présents, pas seulement en cas de perte de connaissance." },
                { text: "Seulement si la victime respire difficilement.", isCorrect: false, comment: "Le retrait est recommandé dans tous les cas avec deux secouristes, indépendamment de la respiration de la victime." },
                { text: "Uniquement en présence d'un médecin.", isCorrect: false, comment: "Le retrait peut être effectué par deux secouristes sans nécessité d'un médecin." }
            ]
        },
        {
            text: "Quelle est la justification du retrait du casque de protection d'une victime ?",
            answers: [
                { text: "Le casque peut gêner dans la réalisation de l'examen et des gestes de secours.", isCorrect: true, comment: "Correct, la présence du casque peut entraver les gestes de secours et l'examen de la victime." },
                { text: "Le casque est généralement endommagé et doit être retiré pour des raisons de sécurité.", isCorrect: false, comment: "La justification principale est liée à la gêne potentielle lors des gestes de secours, pas uniquement à l'état du casque." },
                { text: "Pour identifier la marque du casque.", isCorrect: false, comment: "Le retrait n'est pas motivé par l'identification du casque mais par des considérations de secours." },
                { text: "Pour permettre une meilleure visualisation du visage de la victime.", isCorrect: false, comment: "Le retrait est lié à la réalisation des gestes de secours et non à des considérations visuelles." }
            ]
        },
        {
            text: "Comment doit se positionner le secouriste chargé du retrait du casque parmi les deux intervenants ?",
            answers: [
                { text: "À côté de la tête de la victime en position debout.", isCorrect: false, comment: "La position à genoux dans l'axe de la tête est préférable pour un retrait efficace du casque." },
                { text: "Derrière la victime pour mieux accéder au casque.", isCorrect: false, comment: "La position à genoux dans l'axe de la tête est recommandée pour le retrait du casque." },
                { text: "À genoux dans l'axe de la tête de la victime.", isCorrect: true, comment: "Correct, le secouriste doit se placer à genoux dans l'axe de la tête de la victime pour retirer le casque." },
                { text: "Debout, face à la victime.", isCorrect: false, comment: "La position à genoux dans l'axe de la tête est plus adaptée pour retirer le casque." }
            ]
        },
        {
            text: "Quelle est la principale contrainte liée au retrait du casque de protection ?",
            answers: [
                { text: "Le risque de mobilisation du rachis cervical ou de la tête de la victime.", isCorrect: true, comment: "Correct, le retrait du casque peut entraîner des risques de mobilisation du rachis cervical ou de la tête." },
                { text: "La difficulté à retirer le casque en raison de sa conception.", isCorrect: false, comment: "La contrainte principale est liée aux risques de mobilisation du rachis cervical ou de la tête de la victime." },
                { text: "La complexité des systèmes de fixation du casque.", isCorrect: false, comment: "Bien que les systèmes de fixation puissent poser des défis, la principale contrainte concerne les risques de mobilisation du rachis cervical ou de la tête." },
                { text: "L'absence d'outils appropriés pour retirer le casque.", isCorrect: false, comment: "La principale contrainte est liée aux risques de mobilisation du rachis cervical ou de la tête, pas seulement à l'absence d'outils." }
            ]
        },
        {
            text: "Quelle est la recommandation principale pour éviter d'aggraver l'état de la victime lors du retrait du casque ?",
            answers: [
                { text: "Communiquer régulièrement avec la victime pendant le retrait.", isCorrect: false, comment: "La priorité est de maintenir la stabilité de la nuque et de la tête de la victime pendant le retrait du casque." },
                { text: "Solliciter l'aide d'un médecin avant de retirer le casque.", isCorrect: false, comment: "La recommandation principale concerne la stabilité de la nuque et de la tête pendant le retrait du casque." },
                { text: "Effectuer un examen complet avant de retirer le casque.", isCorrect: false, comment: "La priorité est la stabilité de la nuque et de la tête pendant le retrait du casque, pas un examen préalable." },
                { text: "Maintenir la nuque et la tête de la victime immobiles durant toute la manœuvre.", isCorrect: true, comment: "Correct, la stabilité de la nuque et de la tête est essentielle pour éviter d'aggraver l'état de la victime." }
            ]
        },
        {
            text: "Quelle est la démarche recommandée pour retirer le casque d'une victime lorsque l'on agit seul ?",
            answers: [
                { text: "Demander à la victime de retirer son propre casque.", isCorrect: false, comment: "Le retrait du casque doit être effectué par le secouriste pour garantir la sécurité de la victime." },
                { text: "Détacher les systèmes de fixation, saisir le casque par les parties latérales du bord inférieur et retirer le casque en maintenant la stabilité de la tête de la victime.", isCorrect: true, comment: "Correct, le retrait du casque seul nécessite une approche soigneuse pour maintenir la stabilité de la tête de la victime." },
                { text: "Faire appel à un deuxième secouriste avant de retirer le casque.", isCorrect: false, comment: "Il est recommandé de suivre les directives appropriées pour retirer le casque seul en cas d'urgence." },
                { text: "Observer la victime avant de commencer le retrait du casque.", isCorrect: false, comment: "L'approche appropriée consiste à suivre les étapes de retrait du casque seul de manière sûre et efficace." }
            ]
        },
        {
            text: "Pourquoi le retrait du casque par un seul secouriste est-il considéré comme un geste exceptionnel ?",
            answers: [
                { text: "Car cela peut entraîner des risques de mobilisation du rachis cervical ou de la tête de la victime.", isCorrect: true, comment: "Correct, le retrait du casque par un seul secouriste peut présenter des risques de mobilisation de la nuque ou de la tête." },
                { text: "Parce que les secouristes agissent généralement en équipe.", isCorrect: false, comment: "La principale raison est liée aux risques de mobilisation du rachis cervical ou de la tête." },
                { text: "En raison de la complexité des casques modernes.", isCorrect: false, comment: "La rareté du retrait du casque par un seul secouriste est due principalement aux risques de mobilisation du rachis cervical ou de la tête." },
                { text: "Pour garantir l'efficacité des gestes de secours.", isCorrect: false, comment: "La raison principale est liée aux risques de mobilisation du rachis cervical ou de la tête pendant le retrait du casque." }
            ]
        },
        {
            text: "Quelle est la première étape recommandée pour retirer le casque d'une victime lorsque l'on agit seul ?",
            answers: [
                { text: "Relever la visière du casque.", isCorrect: true, comment: "Correct, la première étape consiste à relever la visière du casque pour préparer le retrait." },
                { text: "Vérifier la respiration de la victime.", isCorrect: false, comment: "La priorité initiale est de libérer la visière du casque pour faciliter le retrait." },
                { text: "Demander à la victime si elle peut retirer elle-même son casque.", isCorrect: false, comment: "La première action du secouriste est de relever la visière du casque pour préparer le retrait." },
                { text: "Se placer dans l'axe de la tête de la victime.", isCorrect: false, comment: "Avant de retirer le casque, il est essentiel de relever la visière pour faciliter le retrait." }
            ]
        },
        {
            text: "Que doit faire le secouriste 2 pendant le retrait du casque pour maintenir la tête de la victime ?",
            answers: [
                { text: "Glisser doucement une main sous la base du crâne de la victime.", isCorrect: true, comment: "Correct, le secouriste 2 doit maintenir la tête en glissant une main sous la base du crâne pendant le retrait du casque." },
                { text: "Demander à la victime de maintenir sa propre tête.", isCorrect: false, comment: "La responsabilité de maintenir la tête de la victime incombe au secouriste 2 pendant le retrait du casque." },
                { text: "Utiliser un coussin d'immobilisation sous la tête de la victime.", isCorrect: false, comment: "Le maintien de la tête pendant le retrait du casque est effectué manuellement par le secouriste 2." },
                { text: "Observer les signes vitaux de la victime pendant le retrait du casque.", isCorrect: false, comment: "La priorité du secouriste 2 est de maintenir la stabilité de la tête de la victime pendant le retrait du casque." }
            ]
        },
        {
            text: "Quelle est la démarche recommandée pour retirer le casque d'une victime en présence de deux secouristes ?",
            answers: [
                { text: "Le secouriste 2 détache les systèmes de fixation pendant que le secouriste 1 maintient la tête de la victime en position neutre.", isCorrect: true, comment: "Correct, la coordination entre les deux secouristes est essentielle pour retirer le casque en toute sécurité." },
                { text: "Demander à la victime de retirer elle-même son casque.", isCorrect: false, comment: "Le retrait du casque doit être effectué par les secouristes pour garantir la sécurité de la victime." },
                { text: "Demander l'aide d'un médecin avant de retirer le casque.", isCorrect: false, comment: "Les secouristes peuvent retirer le casque en suivant les bonnes pratiques sans nécessiter l'intervention immédiate d'un médecin." },
                { text: "Immerger le casque dans l'eau pour le retirer plus facilement.", isCorrect: false, comment: "Le retrait du casque doit être effectué avec précaution en suivant les procédures appropriées." }
            ]
        },
        {
            text: "Quelles sont les indications pour l'application de froid sur une victime consciente ?",
            answers: [
                { text: "Un traumatisme de membre sans plaie apparente ou une piqûre d'insecte.", isCorrect: true, comment: "Correct, l'application de froid est indiquée pour un traumatisme de membre sans plaie ou une piqûre d'insecte chez une victime consciente." },
                { text: "Une blessure ouverte nécessitant une désinfection rapide.", isCorrect: false, comment: "L'application de froid est contre-indiquée sur une plaie ouverte." },
                { text: "Une douleur abdominale sévère.", isCorrect: false, comment: "L'application de froid est principalement indiquée pour les traumatismes de membre ou les piqûres d'insecte chez une victime consciente." },
                { text: "Un état de choc.", isCorrect: false, comment: "L'état de choc n'est pas une indication directe pour l'application de froid sur une victime consciente." }
            ]
        },
        {
            text: "Quel est l'objectif principal de l'application de froid ?",
            answers: [
                { text: "Empêcher la formation de cloques.", isCorrect: false, comment: "Bien que l'application de froid puisse prévenir certaines réactions cutanées, son objectif principal est de réduire la douleur et le gonflement." },
                { text: "Assurer une désinfection locale.", isCorrect: false, comment: "L'application de froid n'est pas destinée à désinfecter, mais plutôt à atténuer la douleur et limiter le gonflement." },
                { text: "Éviter le risque de gelures.", isCorrect: false, comment: "Les gelures peuvent être un risque si l'application de froid est prolongée au-delà des recommandations." },
                { text: "Atténuer la douleur et limiter le gonflement.", isCorrect: true, comment: "Correct, l'application de froid vise à réduire la douleur et le gonflement." },
            ]
        },
        {
            text: "Quelle est la durée maximale recommandée pour l'application de froid ?",
            answers: [
                { text: "Vingt minutes.", isCorrect: true, comment: "Correct, la durée d'application de froid ne doit pas dépasser vingt minutes pour éviter les complications." },
                { text: "Trente minutes.", isCorrect: false, comment: "La durée recommandée est de vingt minutes pour l'application de froid." },
                { text: "Quinze minutes.", isCorrect: false, comment: "La durée maximale est de vingt minutes pour l'application de froid selon les recommandations." },
                { text: "Une heure.", isCorrect: false, comment: "Une application de froid d'une heure serait excessive et pourrait causer des dommages cutanés." }
            ]
        },
        {
            text: "Quelle est la recommandation en cas d'inconfort pendant l'application de froid ?",
            answers: [
                { text: "Arrêter immédiatement l'application de froid.", isCorrect: false, comment: "Une réduction de la durée est préférable à l'arrêt immédiat en cas d'inconfort." },
                { text: "Réduire la durée d'application de moitié.", isCorrect: true, comment: "Correct, en cas d'inconfort pour la victime, la durée d'application de froid peut être réduite de moitié." },
                { text: "Appliquer une source de chaleur pour compenser.", isCorrect: false, comment: "L'application de chaleur n'est pas recommandée pendant le traitement par le froid." },
                { text: "Continuer sans modifier la durée d'application.", isCorrect: false, comment: "Une adaptation de la durée est nécessaire en cas d'inconfort pour la victime." }
            ]
        },
        {
            text: "Quelles sont les principales conséquences d'une application prolongée de froid ?",
            answers: [
                { text: "Réactions cutanées telles que rougeur, pâleur intense, petites cloques ou gelures.", isCorrect: true, comment: "Correct, une application prolongée de froid peut entraîner ces réactions cutanées indésirables." },
                { text: "Amélioration de la circulation sanguine locale.", isCorrect: false, comment: "Une application de froid prolongée n'améliorera pas la circulation sanguine, mais peut au contraire causer des dommages cutanés." },
                { text: "Diminution de la douleur et du gonflement.", isCorrect: false, comment: "Ces effets sont recherchés initialement avec l'application de froid, mais pas les réactions cutanées indésirables." },
                { text: "Ralentissement de la réaction inflammatoire.", isCorrect: false, comment: "L'application de froid vise à réduire le gonflement, mais une exposition prolongée peut entraîner des effets indésirables sur la peau." }
            ]
        },
        {
            text: "Quel est l'objectif principal de l'emballage au moyen d'un pansement stérile ?",
            answers: [
                { text: "Accroître la protection de la zone lésée contre les souillures et limiter la déperdition de chaleur.", isCorrect: true, comment: "Correct, l'emballage au moyen d'un pansement stérile vise principalement à protéger la plaie contre les souillures et à limiter la perte de chaleur." },
                { text: "Empêcher la formation de cicatrices.", isCorrect: false, comment: "Bien que l'emballage puisse aider à prévenir les complications, son objectif principal est la protection contre les souillures et la chaleur." },
                { text: "Assurer une cicatrisation rapide de la plaie.", isCorrect: false, comment: "La cicatrisation dépend de nombreux facteurs, mais l'emballage stérile vise à protéger la plaie contre les infections et les souillures." },
                { text: "Réduire la douleur immédiatement.", isCorrect: false, comment: "L'emballage stérile n'est pas principalement destiné à réduire la douleur, mais à protéger la zone lésée." }
            ]
        },
        {
            text: "Que doit éviter le sauveteur lors de l'utilisation d'un pansement stérile ?",
            answers: [
                { text: "Toucher avec les doigts la partie du pansement qui entrera en contact avec la zone lésée.", isCorrect: true, comment: "Exact, il est crucial d'éviter tout contact avec la partie du pansement qui sera en contact avec la plaie pour maintenir la stérilité." },
                { text: "Utiliser des pansements non stériles pour les plaies étendues.", isCorrect: false, comment: "Les plaies étendues nécessitent généralement des pansements stériles pour éviter les infections." },
                { text: "Envelopper la plaie avec des vêtements ordinaires.", isCorrect: false, comment: "Les plaies graves doivent être protégées avec des pansements stériles appropriés pour éviter les souillures et les complications." },
                { text: "Nettoyer la plaie avant l'application du pansement stérile.", isCorrect: false, comment: "Le nettoyage de la plaie est important, mais il doit être effectué avant l'application du pansement stérile." }
            ]
        },
        {
            text: "Quel type de pansement stérile est décrit comme adapté pour les brûlures graves dans le texte ?",
            answers: [
                { text: "Pansement hydrocolloïde.", isCorrect: false, comment: "Les pansements hydrocolloïdes sont adaptés à d'autres types de plaies, mais pas spécifiquement conçus pour les brûlures graves." },
                { text: "Pansement stérile pour brûlures type SSA", isCorrect: true, comment: "Correct, le pansement stérile pour brûlures type SSA est spécifiquement conçu pour les brûlures graves, offrant une protection accrue et limitant la déperdition de chaleur." },
                { text: "Pansement adhésif non stérile.", isCorrect: false, comment: "Les pansements adhésifs non stériles ne conviennent pas aux brûlures graves en raison du risque d'infection." },
                { text: "Compresses non stériles.", isCorrect: false, comment: "Les compresses non stériles ne doivent pas être utilisées pour les brûlures graves en raison du risque d'infection." }
            ]
        },
        {
            text: "Quelle est la conséquence d'un contact avec la partie du pansement qui entrera en contact avec la zone lésée ?",
            answers: [
                { text: "Risque de contamination et de perte de stérilité.", isCorrect: true, comment: "Exact, le contact avec la partie du pansement qui entrera en contact avec la plaie peut compromettre sa stérilité et augmenter le risque d'infection." },
                { text: "Augmentation de la protection contre les souillures.", isCorrect: false, comment: "Le contact avec le pansement peut en fait diminuer la protection contre les souillures en compromettant sa stérilité." },
                { text: "Meilleure adhérence du pansement à la peau.", isCorrect: false, comment: "Le contact avec la partie du pansement peut rendre plus difficile l'adhérence et compromettre l'efficacité du pansement." },
                { text: "Réduction de la déperdition de chaleur.", isCorrect: false, comment: "La déperdition de chaleur n'est pas directement liée au contact avec la partie du pansement." }
            ]
        },
        {
            text: "Quelle est l'indication principale du maintien d'un pansement avec un filet tubulaire ?",
            answers: [
                { text: "Assurer le maintien d'un pansement non compressif sur une plaie.", isCorrect: true, comment: "Exact, le filet tubulaire permet de maintenir un pansement sans exercer de compression circulaire sur une plaie, tout en laissant à la victime sa liberté de mouvement." },
                { text: "Exercer une compression sur une plaie ou une brûlure.", isCorrect: false, comment: "Le filet tubulaire est utilisé pour maintenir le pansement sans exercer de compression sur la plaie, contrairement à une bande." },
                { text: "Éviter tout contact avec la plaie lors de l'application du pansement.", isCorrect: false, comment: "Le filet tubulaire sert à maintenir le pansement en place, mais il n'est pas conçu pour éviter le contact avec la plaie lors de l'application." },
                { text: "Réduire la mobilité du membre affecté.", isCorrect: false, comment: "Le filet tubulaire permet de maintenir le pansement sans restreindre la liberté de mouvement de la victime." }
            ]
        },
        {
            text: "Quel est le risque associé à un bandage circulaire effectué avec une bande de maintien ?",
            answers: [
                { text: "Déplacement involontaire du pansement.", isCorrect: false, comment: "Le risque principal d'un bandage circulaire est lié à l'effet garrot plutôt qu'au déplacement du pansement." },
                { text: "Effet garrot pouvant compromettre la circulation sanguine du membre.", isCorrect: true, comment: "Correct, un bandage circulaire peut entraîner un effet garrot, ce qui compromet la circulation sanguine du membre." },
                { text: "Augmentation de la protection contre les souillures.", isCorrect: false, comment: "Le bandage circulaire ne vise pas à augmenter la protection contre les souillures, mais à maintenir le pansement en place." },
                { text: "Diminution de la douleur dans la zone affectée.", isCorrect: false, comment: "Le bandage circulaire peut causer des douleurs ou des complications liées à la circulation sanguine plutôt que de les réduire." }
            ]
        },
        {
            text: "Quelle est la conséquence du maintien direct d'un dispositif de maintien sur la plaie ou la brûlure ?",
            answers: [
                { text: "Risque de contamination de la plaie ou de la brûlure.", isCorrect: true, comment: "Exact, le dispositif de maintien ne doit jamais être posé directement sur la plaie ou la brûlure pour éviter tout risque de contamination." },
                { text: "Meilleure protection contre les souillures.", isCorrect: false, comment: "Le maintien direct sur la plaie peut en fait augmenter le risque de contamination plutôt que de protéger contre les souillures." },
                { text: "Amélioration de la cicatrisation de la plaie.", isCorrect: false, comment: "Le maintien direct sur la plaie n'affecte pas directement la cicatrisation, mais peut compromettre la guérison en cas de contamination." },
                { text: "Diminution de la douleur dans la zone affectée.", isCorrect: false, comment: "Le maintien direct sur la plaie peut causer des douleurs ou des complications plutôt que de les réduire." }
            ]
        },
        {
            text: "Quel est le but principal du maintien à l'aide d'un filet tubulaire ?",
            answers: [
                { text: "Maintenir le pansement sans exercer de compression circulaire et sans entraver la circulation sanguine.", isCorrect: true, comment: "Correct, le filet tubulaire permet de maintenir le pansement en place de manière sécurisée sans exercer de compression circulaire ni entraver la circulation sanguine." },
                { text: "Exercer une compression pour réduire le gonflement autour de la plaie.", isCorrect: false, comment: "Le filet tubulaire n'est pas destiné à exercer une compression, mais plutôt à maintenir le pansement en place de manière non contraignante." },
                { text: "Protéger la plaie contre les souillures extérieures.", isCorrect: false, comment: "Le filet tubulaire est principalement utilisé pour maintenir le pansement en place sans exercer de compression ni limiter la circulation." },
                { text: "Faciliter l'application des bandages sur les plaies étendues.", isCorrect: false, comment: "Le filet tubulaire ne facilite pas l'application des bandages mais sert à maintenir le pansement en place." }
            ]
        },
        {
            text: "Quelle est la recommandation concernant le déplacement d'un dispositif de maintien sur une plaie ?",
            answers: [              { text: "Il est recommandé de déplacer le pansement pour éviter les plis.", isCorrect: false, comment: "Déplacer le pansement pendant le maintien peut compromettre son efficacité et sa protection." },
                { text: "Le dispositif ne doit pas déplacer le pansement lors de sa mise en place.", isCorrect: true, comment: "Exact, lors du maintien d'un pansement, le dispositif utilisé ne doit pas déplacer le pansement lui-même pour éviter tout compromis de l'intégrité du pansement." },
                { text: "Il est acceptable que le dispositif déplace légèrement le pansement pour l'ajuster.", isCorrect: false, comment: "Le dispositif ne doit pas déplacer le pansement lors de sa mise en place pour garantir son efficacité." },
                { text: "Le dispositif doit déplacer le pansement pour assurer un ajustement optimal.", isCorrect: false, comment: "Il est essentiel que le dispositif de maintien ne déplace pas le pansement pour maintenir son intégrité et son efficacité." },
  
            ]
        },
        {
            text: "Quelle est la principale indication du pansement ?",
            answers: [                { text: "Réduire la douleur immédiatement après une blessure.", isCorrect: false, comment: "Le pansement est plus destiné à protéger la plaie des infections que pour soulager immédiatement la douleur." },
                { text: "Protéger une plaie après son nettoyage et éventuellement sa désinfection.", isCorrect: true, comment: "Exact, le pansement est utilisé pour protéger une plaie des souillures après son nettoyage et sa désinfection, limitant ainsi le risque d'infection secondaire." },
                { text: "Stopper le saignement d'une plaie ouverte.", isCorrect: false, comment: "Le pansement est principalement utilisé pour protéger une plaie après son nettoyage, pas spécifiquement pour arrêter le saignement initial." },

                { text: "Faciliter l'observation de l'évolution d'une plaie sans la protéger.", isCorrect: false, comment: "Le pansement est conçu pour protéger la plaie, pas pour faciliter l'observation sans protection." }
            ]
        },
        {
            text: "Quel est l'objectif du pansement individuel dans les premiers secours ?",
            answers: [
                { text: "Protéger une plaie non étendue contre les souillures.", isCorrect: true, comment: "Exact, le pansement individuel est utilisé pour protéger une plaie non étendue contre les souillures en fournissant une couverture stérile." },
                { text: "Arrêter le saignement des plaies par balle.", isCorrect: false, comment: "Le pansement individuel n'est pas spécifiquement conçu pour arrêter le saignement des plaies par balle." },
                { text: "Réduire l'inflammation des plaies ouvertes.", isCorrect: false, comment: "Le principal objectif est de protéger la plaie contre les souillures, pas de réduire l'inflammation." },
                { text: "Faciliter le contrôle des saignements sur des brûlures graves.", isCorrect: false, comment: "Ce n'est pas le rôle principal du pansement individuel dans les premiers secours." }
            ]
        },
        {
            text: "Quelle est la fonction principale du pansement Type C ?",
            answers: [
                { text: "Protéger une ou plusieurs plaies en fournissant des compresses de tailles différentes.", isCorrect: true, comment: "Exact, le pansement Type C offre une protection en utilisant des compresses de tailles variées pour couvrir différentes dimensions de plaies." },
                { text: "Arrêter le saignement sur des blessures graves.", isCorrect: false, comment: "Le pansement Type C vise principalement à protéger les plaies en fournissant une couverture avec des compresses de différentes tailles." },
                { text: "Faciliter la désinfection des plaies ouvertes.", isCorrect: false, comment: "La fonction principale n'est pas de faciliter la désinfection mais de protéger les plaies." },
                { text: "Fixer des compresses sur les brûlures du second degré.", isCorrect: false, comment: "Le pansement Type C n'est pas spécifiquement conçu pour les brûlures du second degré." }
            ]
        },
        {
            text: "Comment doit-on placer le membre amputé à l'intérieur du sac isotherme dans le lot membre arraché ou sectionné ?",
            answers: [
                { text: "Sans aucun emballage supplémentaire.", isCorrect: false, comment: "Il est nécessaire d'emballer le membre amputé dans un sac plastique avant de le placer dans le sac isotherme." },
                { text: "À l'intérieur d'un sac plastique contenu dans le sac isotherme.", isCorrect: true, comment: "Exact, le membre amputé doit être placé à l'intérieur d'un sac plastique contenu dans le sac isotherme pour éviter le contact direct avec la source de froid." },
                { text: "Directement en contact avec les sacs réfrigérants ou la glace.", isCorrect: false, comment: "Le membre amputé ne doit pas être en contact direct avec la source de froid pour éviter les gelures." },
                { text: "À l'extérieur du sac isotherme pour un refroidissement rapide.", isCorrect: false, comment: "Le membre amputé doit être protégé à l'intérieur du sac isotherme pour éviter les gelures." }
            ]
        },
        {
            text: "Quel dispositif doit être utilisé pour maintenir le sac isotherme fermé dans le lot membre arraché ou sectionné ?",
            answers: [
                { text: "Un morceau de ruban adhésif.", isCorrect: true, comment: "Exact, un morceau de ruban adhésif est utilisé pour maintenir le sac isotherme fermé lors du transport du membre amputé." },
                { text: "Une épingle de sûreté.", isCorrect: false, comment: "Une épingle de sûreté n'est pas le dispositif recommandé pour maintenir le sac isotherme fermé." },
                { text: "Une bande de crêpe.", isCorrect: false, comment: "Une bande de crêpe n'est pas utilisée pour maintenir le sac isotherme fermé dans ce contexte." },
                { text: "Un dispositif velcro.", isCorrect: false, comment: "Un dispositif velcro n'est généralement pas utilisé pour maintenir le sac isotherme fermé dans ce cas." }
            ]
        },
        {
            text: "Quel dispositif doit être utilisé pour maintenir le sac isotherme fermé dans le lot membre arraché ou sectionné ?",
            answers: [
                { text: "Un morceau de ruban adhésif.", isCorrect: true, comment: "Exact, un morceau de ruban adhésif est utilisé pour maintenir le sac isotherme fermé lors du transport du membre amputé." },
                { text: "Une épingle de sûreté.", isCorrect: false, comment: "Une épingle de sûreté n'est pas le dispositif recommandé pour maintenir le sac isotherme fermé." },
                { text: "Une bande de crêpe.", isCorrect: false, comment: "Une bande de crêpe n'est pas utilisée pour maintenir le sac isotherme fermé dans ce contexte." },
                { text: "Un dispositif velcro.", isCorrect: false, comment: "Un dispositif velcro n'est généralement pas utilisé pour maintenir le sac isotherme fermé dans ce cas." }
            ]
        },
        {
            text: "Que doit-on inscrire sur le sac isotherme dans le lot membre arraché ou sectionné ?",
            answers: [
                { text: "Le nom de la victime et l'heure de survenue de l'amputation.", isCorrect: true, comment: "Exact, il est important d'indiquer le nom de la victime et l'heure de survenue de l'amputation sur le sac isotherme pour une identification rapide lors de l'intervention médicale." },
                { text: "La taille du membre amputé.", isCorrect: false, comment: "La taille du membre amputé n'est pas nécessairement indiquée sur le sac isotherme." },
                { text: "La température du sac réfrigérant.", isCorrect: false, comment: "La température du sac réfrigérant n'est pas spécifiquement requise sur le sac isotherme." },
                { text: "Le nom de l'hôpital de destination.", isCorrect: false, comment: "Le nom de l'hôpital de destination n'est pas nécessairement inscrit sur le sac isotherme." }
            ]
        },
        {
            text: "Que doit-on éviter pour ne pas compromettre la réussite de la réimplantation du membre amputé ?",
            answers: [
                { text: "Le contact direct du membre avec la source de froid.", isCorrect: true, comment: "Exact, le contact direct avec la source de froid peut entraîner des gelures qui compromettent la réimplantation du membre amputé." },
                { text: "L'utilisation de ruban adhésif pour maintenir le sac isotherme fermé.", isCorrect: false, comment: "L'utilisation de ruban adhésif pour fermer le sac isotherme n'est pas directement liée à la réimplantation du membre amputé." },
                { text: "L'absence d'identification sur le sac isotherme.", isCorrect: false, comment: "L'absence d'identification sur le sac isotherme n'affecte pas directement la réussite de la réimplantation." },
                { text: "L'exposition prolongée à l'air ambiant.", isCorrect: false, comment: "L'exposition prolongée à l'air ambiant n'est pas liée à la réimplantation du membre amputé mais au risque de contamination." }
            ]
        },
        {
            text: "Quel dispositif est utilisé pour maintenir le sac isotherme fermé lors du transport du membre amputé ?",
            answers: [
                { text: "Un morceau de ruban adhésif.", isCorrect: true, comment: "Exact, un morceau de ruban adhésif est utilisé pour maintenir fermé le sac isotherme lors du transport du membre amputé." },
                { text: "Une épingle de sûreté.", isCorrect: false, comment: "Une épingle de sûreté n'est pas utilisée pour maintenir le sac isotherme fermé lors du transport du membre amputé." },
                { text: "Une bande de crêpe.", isCorrect: false, comment: "Une bande de crêpe n'est pas le dispositif utilisé pour maintenir fermé le sac isotherme." },
                { text: "Un dispositif velcro.", isCorrect: false, comment: "Un dispositif velcro n'est généralement pas utilisé pour maintenir fermé le sac isotherme." }
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
