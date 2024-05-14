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
    "text": "Que faut-il faire en cas de traumatisme dentaire ?",
    "answers": [
        {
            "text": "a) Faire avaler à la victime de l'eau de javel",
            "isCorrect": false,
            "comment": "Faire avaler de l'eau de javel à la victime peut être dangereux. Il est important de consulter un professionnel de la santé."
        },
        {
            "text": "b) Rincer la dent tombée pendant 1 minute sous l'eau courante",
            "isCorrect": false,
            "comment": "Rincer la dent tombée sous l'eau courante peut endommager les tissus. La dent doit être manipulée avec précaution."
        },
        {
            "text": "c) Garder la dent dans de l'eau du robinet",
            "isCorrect": false,
            "comment": "Conserver la dent dans de l'eau du robinet n'est pas recommandé. Elle devrait plutôt être placée dans du lait ou dans une solution saline."
        },
        {
            "text": "d) Consulter immédiatement un chirurgien-dentiste",
            "isCorrect": true,
            "comment": "En cas de traumatisme dentaire, il est crucial de consulter immédiatement un professionnel de la santé dentaire pour évaluer la blessure et fournir un traitement approprié."
        }
    ]
},
{
  "text": "Quelle est la conduite à tenir en présence d'un traumatisme dentaire avec délogement d'une dent ?",
  "answers": [
      {
          "text": "a) Faire boire de l'eau froide à la victime",
          "isCorrect": false,
          "comment": "Faire boire de l'eau froide à la victime n'est pas la conduite à tenir en cas de traumatisme dentaire avec délogement d'une dent."
      },
      {
          "text": "b) Rincer la dent tombée avec du savon",
          "isCorrect": false,
          "comment": "Rincer la dent avec du savon n'est pas recommandé, car cela peut contaminer la dent."
      },
      {
          "text": "c) Recueillir la dent tombée et la transporter avec la victime",
          "isCorrect": true,
          "comment": "En cas de traumatisme dentaire avec délogement d'une dent, il est important de recueillir la dent tombée et de la transporter avec la victime pour une éventuelle réimplantation."
      },
      {
          "text": "d) Laisser la dent sur le sol et appeler immédiatement les secours",
          "isCorrect": false,
          "comment": "Il est important de recueillir la dent tombée pour éviter sa perte et de contacter immédiatement les secours pour obtenir des conseils supplémentaires."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en cas de traumatisme dentaire ?",
  "answers": [
      {
          "text": "a) Demander à la victime de boire de l'alcool pour désinfecter la plaie",
          "isCorrect": false,
          "comment": "Boire de l'alcool ne désinfectera pas la plaie et peut même aggraver la situation en altérant l'état de la victime."
      },
      {
          "text": "b) Demander à la victime de garder la dent tombée dans de l'eau du robinet",
          "isCorrect": false,
          "comment": "Garder la dent dans de l'eau du robinet peut endommager les tissus de la dent et réduire les chances de la réimplanter avec succès."
      },
      {
          "text": "c) Demander à la victime de se rincer la bouche avec de l'eau",
          "isCorrect": true,
          "comment": "Rincer la bouche avec de l'eau peut aider à éliminer les débris et à réduire le risque d'infection après un traumatisme dentaire."
      },
      {
          "text": "d) Demander à la victime de ne pas consulter de médecin",
          "isCorrect": false,
          "comment": "Il est important de consulter un médecin ou un dentiste dès que possible en cas de traumatisme dentaire pour évaluer les dommages et administrer un traitement approprié."
      }
  ]
},
{
  "text": "Quelles sont les principales causes de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Piqûre d'insecte",
          "isCorrect": false,
          "comment": "Les piqûres d'insectes ne sont généralement pas des causes majeures de traumatisme abdominal."
      },
      {
          "text": "b) Explosion",
          "isCorrect": true,
          "comment": "Les explosions peuvent causer des traumatismes abdominaux graves."
      },
      {
          "text": "c) Éruption volcanique",
          "isCorrect": false,
          "comment": "Les éruptions volcaniques sont peu susceptibles de causer des traumatismes abdominaux."
      },
      {
          "text": "d) Brûlure chimique",
          "isCorrect": false,
          "comment": "Les brûlures chimiques peuvent causer des lésions cutanées, mais pas nécessairement des traumatismes abdominaux."
      }
  ]
},
{
  "text": "Quel risque est associé aux traumatismes avec atteinte des organes creux ?",
  "answers": [
      {
          "text": "a) Risque de détresse respiratoire",
          "isCorrect": false,
          "comment": "Bien que la détresse respiratoire puisse être une complication, le risque principal est l'infection due à la perforation des organes."
      },
      {
          "text": "b) Risque d'hypothermie",
          "isCorrect": false,
          "comment": "Le risque principal est l'infection, pas l'hypothermie."
      },
      {
          "text": "c) Risque infectieux",
          "isCorrect": true,
          "comment": "Les traumatismes avec atteinte des organes creux augmentent le risque d'infection."
      },
      {
          "text": "d) Risque de fracture",
          "isCorrect": false,
          "comment": "Les organes creux ne peuvent pas subir de fracture."
      }
  ]
},
{
  "text": "Comment peut se manifester une éviscération ?",
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
  "text": "Quelle est la conduite à tenir en présence d'une éviscération ?",
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
  "text": "Pourquoi faut-il protéger la victime contre le froid, le vent ou la chaleur en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Pour éviter la propagation de l'infection",
          "isCorrect": false,
          "comment": "La protection contre le froid, le vent ou la chaleur vise principalement à prévenir l'hypothermie ou l'hyperthermie."
      },
      {
          "text": "b) Pour prévenir l'hypothermie ou l'hyperthermie",
          "isCorrect": true,
          "comment": "Le traumatisme abdominal peut perturber la régulation de la température corporelle, ce qui rend la protection contre les températures extrêmes importante."
      },
      {
          "text": "c) Pour éviter les réactions allergiques",
          "isCorrect": false,
          "comment": "Les réactions allergiques ne sont pas liées directement au traumatisme abdominal."
      },
      {
          "text": "d) Pour empêcher la détérioration de la plaie",
          "isCorrect": false,
          "comment": "La protection contre les éléments vise à maintenir la stabilité de la température corporelle, pas à prévenir la détérioration de la plaie."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir spécifique pour toute femme enceinte victime d'un traumatisme violent ?",
  "answers": [
      {
          "text": "a) La faire marcher pour favoriser la circulation sanguine",
          "isCorrect": false,
          "comment": "Marcher peut aggraver les blessures chez une femme enceinte victime d'un traumatisme violent."
      },
      {
          "text": "b) La placer en position assise pour soulager la pression abdominale",
          "isCorrect": false,
          "comment": "La position assise peut mettre davantage de pression sur l'abdomen. Une évaluation médicale immédiate est nécessaire."
      },
      {
          "text": "c) La considérer comme traumatisée de l'abdomen et la faire consulter dans un service d'urgence ou spécialisé",
          "isCorrect": true,
          "comment": "Toute femme enceinte victime d'un traumatisme violent doit être considérée comme présentant un risque pour le fœtus et doit être évaluée immédiatement par un professionnel de la santé."
      },
      {
          "text": "d) Appliquer un pansement stérile sur l'abdomen pour protéger le fœtus",
          "isCorrect": false,
          "comment": "L'application d'un pansement ne suffit pas. Une évaluation médicale complète est nécessaire."
      }
  ]
},
{
  "text": "Quelle est la priorité dans l'action de secours en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Identifier la gravité de la plaie",
          "isCorrect": false,
          "comment": "Bien qu'il soit important d'évaluer la plaie, la priorité est de prévenir toute détresse circulatoire en surveillant attentivement la victime."
      },
      {
          "text": "b) Installer ou transporter la victime dans une position d'attente adaptée",
          "isCorrect": false,
          "comment": "La première priorité est de stabiliser la victime dans la position la plus confortable pour prévenir d'autres dommages."
      },
      {
          "text": "c) Examiner la victime pour rechercher des lésions",
          "isCorrect": false,
          "comment": "Bien qu'il soit nécessaire d'examiner la victime, la priorité initiale est de prévenir toute détresse circulatoire."
      },
      {
          "text": "d) Prévenir toute détresse circulatoire par une surveillance attentive",
          "isCorrect": true,
          "comment": "La priorité est de surveiller attentivement la victime pour détecter et traiter rapidement toute détresse circulatoire."
      }
  ]
},
{
  "text": "Quels sont les trois types principaux de causes de traumatisme abdominal énumérés dans le texte ?",
  "answers": [
      {
          "text": "a) Choc électrique, brûlure chimique, gelure",
          "isCorrect": false,
          "comment": "Ces éléments ne sont pas des causes principales de traumatisme abdominal."
      },
      {
          "text": "b) Explosion, chute de grande hauteur, accident de vélo",
          "isCorrect": false,
          "comment": "Bien que ces événements puissent causer des blessures, ils ne sont pas les principales causes de traumatisme abdominal énumérées."
      },
      {
          "text": "c) Pénétration d'un corps étranger, traumatisme direct, décélération brusque",
          "isCorrect": true,
          "comment": "Ce sont en effet les principaux types de causes de traumatisme abdominal énumérés."
      },
      {
          "text": "d) Éruption volcanique, avalanche, tremblement de terre",
          "isCorrect": false,
          "comment": "Ces événements peuvent causer des traumatismes, mais ils ne sont pas spécifiquement liés aux traumatismes abdominaux."
      }
  ]
},
{
  "text": "Quel est le risque associé aux traumatismes avec atteinte des gros vaisseaux abdominaux ?",
  "answers": [
      {
          "text": "a) Risque de brûlures",
          "isCorrect": false,
          "comment": "Les gros vaisseaux abdominaux ne sont pas associés aux brûlures, mais plutôt aux hémorragies internes."
      },
      {
          "text": "b) Risque de détresse circulatoire par hémorragie interne",
          "isCorrect": true,
          "comment": "Les blessures aux gros vaisseaux abdominaux peuvent entraîner une perte de sang importante et une détresse circulatoire."
      },
      {
          "text": "c) Risque de lésions nerveuses",
          "isCorrect": false,
          "comment": "Les gros vaisseaux abdominaux ne sont pas associés aux lésions nerveuses, mais plutôt aux hémorragies et à la détresse circulatoire."
      },
      {
          "text": "d) Risque de détresse respiratoire",
          "isCorrect": false,
          "comment": "Les problèmes respiratoires ne sont pas directement liés aux traumatismes des gros vaisseaux abdominaux."
      }
  ]
},
{
  "text": "Pourquoi faut-il rechercher l'existence de lésions dans le dos de la victime en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Pour vérifier si la victime peut marcher",
          "isCorrect": false,
          "comment": "La capacité de marcher n'est pas la principale préoccupation lors de la recherche de lésions dans le dos."
      },
      {
          "text": "b) Pour évaluer la gravité de la plaie",
          "isCorrect": false,
          "comment": "L'évaluation de la gravité de la plaie se concentre sur la zone abdominale, pas nécessairement sur le dos."
      },
      {
          "text": "c) Pour identifier d'autres sources de douleur",
          "isCorrect": true,
          "comment": "Les lésions dans le dos peuvent indiquer d'autres traumatismes ou fractures qui pourraient être liés au traumatisme abdominal."
      },
      {
          "text": "d) Pour appliquer un traitement spécifique aux lésions du dos",
          "isCorrect": false,
          "comment": "L'identification des lésions dans le dos est principalement pour évaluer l'étendue des dommages et planifier le traitement global, pas seulement pour les lésions du dos."
      }
  ]
},
{
  "text": "Quelle position doit être adoptée par la victime en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Position debout",
          "isCorrect": false,
          "comment": "Une position debout peut aggraver les lésions internes. Une position allongée est généralement recommandée."
      },
      {
          "text": "b) Position allongée, à plat ventre, jambes tendues",
          "isCorrect": false,
          "comment": "Une position à plat ventre peut exercer une pression sur l'abdomen. Une position allongée sur le dos avec les jambes fléchies est souvent préférée."
      },
      {
          "text": "c) Position assise, jambes croisées",
          "isCorrect": false,
          "comment": "Une position assise peut exercer une pression sur l'abdomen et ne pas être confortable pour la victime."
      },
      {
          "text": "d) Position allongée, à plat dos, jambes fléchies",
          "isCorrect": true,
          "comment": "Cette position aide à soulager la pression sur l'abdomen et à prévenir d'autres dommages."
      }
  ]
},
{
  "text": "Quel est le pourcentage approximatif de mortalité des traumatismes du bassin ?",
  "answers": [
      {
          "text": "a) 2-5%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus élevé, allant jusqu'à environ 8-15%."
      },
      {
          "text": "b) 5-8%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus élevé, allant jusqu'à environ 8-15%."
      },
      {
          "text": "c) 8-15%",
          "isCorrect": true,
          "comment": "Le taux de mortalité des traumatismes du bassin se situe généralement dans cette plage, allant jusqu'à environ 8-15%."
      },
      {
          "text": "d) 15-20%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus bas que cela, se situant autour de 8-15%."
      }
  ]
},
{
  "text": "Quel signe évoque un traumatisme du bassin si la victime peut s'exprimer ?",
  "answers": [
      {
          "text": "a) Douleur dans les bras",
          "isCorrect": false,
          "comment": "La douleur dans les bras n'est pas spécifique aux traumatismes du bassin."
      },
      {
          "text": "b) Douleur dans le cou",
          "isCorrect": false,
          "comment": "La douleur dans le cou n'est pas spécifique aux traumatismes du bassin."
      },
      {
          "text": "c) Douleur dans le bassin ou la partie basse de l'abdomen",
          "isCorrect": true,
          "comment": "La douleur dans le bassin ou la partie basse de l'abdomen peut être un signe de traumatisme à cette région."
      },
      {
          "text": "d) Douleur dans les jambes",
          "isCorrect": false,
          "comment": "La douleur dans les jambes n'est pas spécifique aux traumatismes du bassin."
      }
  ]
},
{
  "text": "Quel élément ne fait pas partie des signes observables lors de l'examen d'une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Douleur du bassin",
          "isCorrect": false,
          "comment": "La douleur du bassin est souvent un signe observable d'un traumatisme à cette région."
      },
      {
          "text": "b) Impossibilité de bouger les membres inférieurs",
          "isCorrect": false,
          "comment": "L'impossibilité de bouger les membres inférieurs peut être un signe observable de traumatisme du bassin."
      },
      {
          "text": "c) Respiration difficile",
          "isCorrect": true,
          "comment": "La respiration difficile n'est généralement pas un signe observable directement lié aux traumatismes du bassin."
      },
      {
          "text": "d) Urine sanglante ou présence de sang sur les sous-vêtements",
          "isCorrect": false,
          "comment": "La présence d'urine sanglante ou de sang sur les sous-vêtements peut indiquer un traumatisme du bassin."
      }
  ]
},
{
  "text": "Quelle action est recommandée en cas de détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Appliquer un pansement sur la plaie",
          "isCorrect": false,
          "comment": "Bien qu'un pansement puisse être nécessaire, la détresse circulatoire doit être gérée en priorité."
      },
      {
          "text": "b) Mettre la victime en position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin avec détresse circulatoire."
      },
      {
          "text": "c) Immobiliser le bassin",
          "isCorrect": true,
          "comment": "Immobiliser le bassin peut aider à prévenir toute aggravation de la blessure et à stabiliser la victime."
      },
      {
          "text": "d) Appliquer de la chaleur sur la zone affectée",
          "isCorrect": false,
          "comment": "L'application de chaleur peut ne pas être appropriée, surtout en cas de suspicion d'hémorragie interne."
      }
  ]
},
{
  "text": "Quelle est la première mesure à prendre lors de l'action de secours pour une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Installer la victime dans une position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin avec détresse circulatoire."
      },
      {
          "text": "b) Contacter les services d'urgence",
          "isCorrect": false,
          "comment": "Bien que contacter les services d'urgence soit essentiel, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "c) Prévenir toute détresse circulatoire par une surveillance attentive",
          "isCorrect": true,
          "comment": "Prévenir toute détresse circulatoire est essentiel pour assurer la stabilité de la victime."
      },
      {
          "text": "d) Examiner les membres supérieurs",
          "isCorrect": false,
          "comment": "Bien que l'examen des membres supérieurs puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Qu'est-ce que laisser la victime en une \"position allongée stricte\" signifie dans le contexte de l'action de secours pour un traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Position allongée sur le côté",
          "isCorrect": false,
          "comment": "La position allongée sur le dos, les jambes tendues, est généralement recommandée."
      },
      {
          "text": "b) Position allongée sur le dos, les jambes tendues",
          "isCorrect": true,
          "comment": "Cette position aide à stabiliser la victime et à prévenir toute aggravation du traumatisme."
      },
      {
          "text": "c) Position allongée sur le ventre",
          "isCorrect": false,
          "comment": "La position sur le ventre peut ne pas être appropriée pour une victime de traumatisme du bassin."
      },
      {
          "text": "d) Position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin."
      }
  ]
},
{
  "text": "Pourquoi est-il recommandé de dénuder le bassin de la victime lors de l'action de secours ?",
  "answers": [
      {
          "text": "a) Pour vérifier la présence de lésions et de sang sur les sous-vêtements",
          "isCorrect": true,
          "comment": "Cela permet d'évaluer les dommages potentiels et d'identifier toute blessure cachée."
      },
      {
          "text": "b) Pour faciliter la respiration de la victime",
          "isCorrect": false,
          "comment": "Bien que la respiration soit importante, ce n'est pas la principale raison de dénuder le bassin."
      },
      {
          "text": "c) Pour réduire la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse aider, ce n'est pas la principale raison de dénuder le bassin."
      },
      {
          "text": "d) Pour identifier d'autres blessures sur le corps",
          "isCorrect": false,
          "comment": "L'identification d'autres blessures est un avantage, mais ce n'est pas la principale raison de dénuder le bassin."
      }
  ]
},

{
  "text": "Quelle est la mesure recommandée si la victime présente un traumatisme du bassin associé à des signes de détresse circulatoire ?",
  "answers": [
      {
          "text": "a) Appliquer un pansement compressif",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "b) Immobiliser la victime",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse circulatoire."
      },
      {
          "text": "c) Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la région et à prévenir toute aggravation de la blessure."
      },
      {
          "text": "d) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Comment doit être protégée une victime de traumatisme du bassin contre les éléments environnementaux ?",
  "answers": [
      {
          "text": "a) En l'isolant dans une pièce calme",
          "isCorrect": false,
          "comment": "Isoler la victime dans une pièce calme peut ne pas être pratique dans toutes les situations d'urgence."
      },
      {
          "text": "b) En la recouvrant d'une couverture",
          "isCorrect": true,
          "comment": "Recouvrir la victime d'une couverture peut aider à maintenir sa chaleur corporelle et à prévenir l'hypothermie."
      },
      {
          "text": "c) En la plaçant à l'ombre",
          "isCorrect": false,
          "comment": "Placer la victime à l'ombre peut être bénéfique, mais ce n'est pas la principale mesure pour la protéger contre les éléments environnementaux."
      },
      {
          "text": "d) En la massant",
          "isCorrect": false,
          "comment": "Masser la victime peut ne pas être approprié dans le contexte d'un traumatisme du bassin."
      }
  ]
},
{
  "text": "Quelle est la principale action recommandée en présence d'une détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Appliquer un pansement sur la plaie",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "b) Immobiliser la victime",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse vitale."
      },
      {
          "text": "c) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "La gestion de la douleur peut être nécessaire, mais il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "d) Appliquer la conduite à tenir adaptée à son état",
          "isCorrect": true,
          "comment": "Appliquer la conduite à tenir adaptée à l'état de la victime est crucial pour assurer sa survie."
      }
  ]
},
{
  "text": "Quel est l'objectif de limiter toute mobilisation de la victime, sauf en cas de nécessité absolue, dans l'action de secours pour un traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Pour éviter la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être un résultat, l'objectif principal est de prévenir toute aggravation de la blessure."
      },
      {
          "text": "b) Pour éviter toute aggravation de la blessure",
          "isCorrect": true,
          "comment": "Limiter la mobilisation peut aider à prévenir des dommages supplémentaires au bassin et aux structures environnantes."
      },
      {
          "text": "c) Pour faciliter le transport de la victime",
          "isCorrect": false,
          "comment": "Le transport de la victime peut nécessiter une mobilisation, mais la priorité est d'éviter toute aggravation de la blessure."
      },
      {
          "text": "d) Pour permettre à la victime de se reposer",
          "isCorrect": false,
          "comment": "Bien que le repos soit important, limiter la mobilisation vise principalement à prévenir toute aggravation de la blessure."
      }
  ]
},
{
  "text": "Que doit-on rechercher en particulier lors de la dénudation du bassin de la victime ?",
  "answers": [
      {
          "text": "a) La présence de lésions sur le visage",
          "isCorrect": false,
          "comment": "Bien que la vérification des blessures soit importante, le visage n'est pas directement lié au traumatisme du bassin."
      },
      {
          "text": "b) La présence de lésions dans le dos ou au niveau des fesses",
          "isCorrect": true,
          "comment": "Les lésions dans le dos ou au niveau des fesses peuvent indiquer des blessures potentielles au bassin ou à la colonne vertébrale."
      },
      {
          "text": "c) La présence de lésions sur les membres supérieurs",
          "isCorrect": false,
          "comment": "Bien que cela puisse être important, le focus principal est sur le bassin et les régions environnantes."
      },
      {
          "text": "d) La présence de lésions sur les chevilles",
          "isCorrect": false,
          "comment": "Bien que cela puisse être important, le focus principal est sur le bassin et les régions environnantes."
      }
  ]
},
{
  "text": "Quel est le but de la contention externe du bassin ?",
  "answers": [
      {
          "text": "a) Réduire la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse aider, le but principal est de stabiliser le bassin et de prévenir toute aggravation de la blessure."
      },
      {
          "text": "b) Faciliter la respiration",
          "isCorrect": false,
          "comment": "Bien que cela puisse être bénéfique, le but principal est de stabiliser le bassin et de prévenir toute aggravation de la blessure."
      },
      {
          "text": "c) Prévenir toute aggravation de la blessure",
          "isCorrect": false,
          "comment": "La contention externe vise à stabiliser le bassin, mais il y a un autre objectif plus spécifique."
      },
      {
          "text": "d) Stabiliser le bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin vise à stabiliser la région et à prévenir toute détérioration de la blessure."
      }
  ]
},
{
  "text": "Quelle est la recommandation en cas d'impossibilité d'obtenir un avis médical pour une victime de traumatisme du bassin présentant des signes de détresse circulatoire ?",
  "answers": [
      {
          "text": "a) Attendre l'arrivée des secours sans intervention",
          "isCorrect": false,
          "comment": "En cas de détresse circulatoire, des mesures doivent être prises pour stabiliser la victime jusqu'à l'arrivée des secours."
      },
      {
          "text": "b) Immobiliser la victime sans aucune autre mesure",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse circulatoire."
      },
      {
          "text": "c) Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la victime en attendant l'arrivée des secours médicaux."
      },
      {
          "text": "d) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Quelle mesure supplémentaire est nécessaire en présence d'une détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Demander à la victime de bouger ses membres",
          "isCorrect": false,
          "comment": "En cas de détresse vitale, d'autres mesures prioritaires doivent être prises pour stabiliser la victime."
      },
      {
          "text": "b) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "La gestion de la douleur peut être nécessaire, mais il y a une autre mesure plus importante en cas de détresse vitale."
      },
      {
          "text": "c) Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la victime en cas de détresse vitale."
      },
      {
          "text": "d) Appliquer un pansement compressif",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une autre mesure plus importante en cas de détresse vitale."
      }
  ]
},

{
    "text": "Qu'est-ce qui peut causer un traumatisme crânien ?",
    "answers": [
        {
            text: "Se blesser par un objet pénétrant",
            isCorrect: true,
            comment: "Se blesser par un objet pénétrant"
        },
        {
            text: "Tomber d'une grande hauteur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Respirer de l'oxygène",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Faire de l'exercice physique",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
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
    "text": "Que doit faire l'intervenant en présence d'une victime qui respire mais a perdu connaissance ?",
    "answers": [
        {
            text: "Rien, car la victime respire",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Administrer de l'oxygène en inhalation",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        },
        {
            text: "Appliquer la conduite à tenir adaptée à une victime qui présente une détresse vitale",
            isCorrect: true,
            comment: "Réponse correcte : Appliquer la conduite à tenir adaptée à une victime qui présente une détresse vitale"
        },
        {
            text: "Appeler les secours et attendre leur arrivée",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelles sont les conséquences possibles d'une décélération brutale de la tête sans choc sur un obstacle ?",
    "answers": [
        {
            text: "Aucune",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse."
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
    "text": "Que doit faire l'intervenant si l'immobilisation du rachis est nécessaire ?",
    "answers": [
        {
            "text": "Rien, car cela pourrait aggraver la situation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'immobilisation du rachis est cruciale pour éviter tout mouvement qui pourrait aggraver les lésions existantes. Il est essentiel d'immobiliser correctement le rachis en utilisant des sangles ou d'autres dispositifs d'immobilisation appropriés."
        },
        {
            "text": "Immobiliser la victime avec des sangles",
            "isCorrect": true,
            "comment": "Réponse correcte : Lorsque l'immobilisation du rachis est nécessaire, l'intervenant doit immobiliser la victime en utilisant des sangles ou d'autres dispositifs d'immobilisation appropriés pour maintenir le rachis dans une position stable et éviter tout mouvement qui pourrait aggraver les lésions."
        },
        {
            "text": "Demander à la victime de bouger pour voir si elle ressent de la douleur",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Demander à la victime de bouger peut aggraver les lésions potentielles du rachis et ne doit pas être fait avant l'évaluation médicale appropriée. L'immobilisation est la priorité pour prévenir les dommages supplémentaires."
        },
        {
            "text": "Appliquer de la glace sur la zone affectée",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Bien que l'application de glace puisse être appropriée pour certaines blessures, elle n'est pas recommandée pour l'immobilisation du rachis. L'utilisation de dispositifs d'immobilisation est préférable pour maintenir la stabilité du rachis."
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
    "text": "Quelle est la conduite à tenir en présence d'une détresse vitale ?",
    "answers": [
        {
            "text": "Attendre l'arrivée des secours sans intervenir",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. En présence d'une détresse vitale, il est important de traiter prioritairement la situation selon les procédures adéquates."
        },
        {
            "text": "Traiter prioritairement la détresse vitale selon la conduite à tenir adéquate",
            "isCorrect": true,
            "comment": "Réponse correcte : En cas de détresse vitale, il faut agir immédiatement en suivant les procédures appropriées pour sauver la vie de la victime."
        },
        {
            "text": "Demander à la victime de se lever et de marcher",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une détresse vitale nécessite une intervention immédiate et ne doit pas être ignorée."
        },
        {
            "text": "Donner à la victime un verre d'eau pour la réconforter",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Donner à boire à une victime en détresse vitale ne résoudra pas le problème sous-jacent."
        }
    ]
},
{
    "text": "Quelles sont les détresses vitales prioritaires ?",
    "answers": [
        {
            "text": "Une douleur au niveau du dos",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une douleur au dos n'est pas nécessairement une détresse vitale."
        },
        {
            "text": "Une obstruction des voies aériennes",
            "isCorrect": true,
            "comment": "Réponse correcte : Une obstruction des voies respiratoires est une détresse vitale prioritaire nécessitant une intervention immédiate."
        },
        {
            "text": "Un engourdissement dans les pieds",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un engourdissement dans les pieds n'est pas une détresse vitale, bien que cela puisse indiquer d'autres problèmes de santé."
        },
        {
            "text": "Un saignement mineur sur le bras",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un saignement mineur n'est généralement pas considéré comme une détresse vitale, sauf s'il est associé à une hémorragie importante."
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
    "text": "Quelles sont les actions à entreprendre en cas de plaie pénétrante isolée du thorax, du cou ou de la tête ?",
    "answers": [
        {
            "text": "Immobiliser immédiatement la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. L'immobilisation immédiate n'est pas toujours nécessaire en cas de plaie pénétrante, surtout si elle est isolée au thorax, au cou ou à la tête."
        },
        {
            "text": "Appliquer une crème antiseptique sur la plaie",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une crème antiseptique peut ne pas être suffisante pour traiter une plaie pénétrante."
        },
        {
            "text": "Appliquer la conduite à tenir adéquate pour une plaie du thorax, du cou ou de la tête",
            "isCorrect": true,
            "comment": "Réponse correcte : En cas de plaie pénétrante isolée au thorax, au cou ou à la tête, il est important d'appliquer la conduite à tenir appropriée pour chaque situation spécifique."
        },
        {
            "text": "Ignorer la plaie et se concentrer sur d'autres blessures",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Toutes les plaies pénétrantes nécessitent une évaluation et une prise en charge appropriées pour éviter des complications graves."
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
"text": "Quelle est la conduite à tenir en présence d'une détresse respiratoire ?",
"answers": [
    {
        "text": "Attendre l'arrivée des secours sans intervenir",
        "isCorrect": false,
        "comment": "Ce n'est pas la bonne réponse. En cas de détresse respiratoire, une intervention immédiate est nécessaire pour traiter la cause et éviter des complications graves."
    },
    {
        "text": "Traiter immédiatement la cause de la détresse respiratoire",
        "isCorrect": true,
        "comment": "Réponse correcte : En présence d'une détresse respiratoire, il est crucial de traiter immédiatement la cause sous-jacente pour stabiliser la respiration de la victime et éviter des complications graves."
    },
    {
        "text": "Encourager la victime à parler pour vérifier sa respiration",
        "isCorrect": false,
        "comment": "Ce n'est pas la bonne réponse. Encourager la victime à parler ne traite pas la détresse respiratoire et peut même aggraver la situation en cas de difficultés respiratoires."
    },
    {
        "text": "Donner à la victime des médicaments pour calmer l'anxiété",
        "isCorrect": false,
        "comment": "Ce n'est pas la bonne réponse. Donner des médicaments pour calmer l'anxiété ne traite pas la cause de la détresse respiratoire et peut retarder la prise en charge appropriée."
    }
]
},
{
    "text": "Quels sont les signes d'une détresse respiratoire ?",
    "answers": [
        {
            "text": "Une plaie ouverte sur le bras",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une plaie ouverte sur le bras n'est pas un signe de détresse respiratoire."
        },
        {
            "text": "Une respiration rapide et superficielle",
            "isCorrect": true,
            "comment": "Réponse correcte : Une respiration rapide et superficielle est un signe courant de détresse respiratoire, indiquant une difficulté à obtenir suffisamment d'oxygène."
        },
        {
            "text": "Une douleur abdominale légère",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une douleur abdominale légère n'est pas spécifique à la détresse respiratoire."
        },
        {
            "text": "Un engourdissement dans les jambes",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Un engourdissement dans les jambes n'est pas un signe de détresse respiratoire."
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
    "text": "Quand utiliser une minerve souple ?",
    "answers": [
        {
            "text": "Lorsqu'il est nécessaire d'immobiliser le rachis cervical sans suspicion de lésion",
            "isCorrect": true,
            "comment": "Réponse correcte : Une minerve souple est utilisée lorsqu'il est nécessaire d'immobiliser le rachis cervical sans suspicion de lésion pour des raisons de précaution ou de confort."
        },
        {
            "text": "Uniquement en cas de traumatisme crânien",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une minerve souple peut être utilisée dans diverses situations, pas uniquement en cas de traumatisme crânien."
        },
        {
            "text": "Lorsque la victime se plaint de douleurs au dos",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une minerve souple n'est pas spécifiquement utilisée pour les douleurs au dos, mais plutôt pour l'immobilisation du rachis cervical."
        },
        {
            "text": "Lorsqu'il est difficile d'appliquer un collier cervical rigide",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. Une minerve souple n'est pas utilisée en remplacement d'un collier cervical rigide, mais dans des situations où une immobilisation moins contraignante est nécessaire."
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
    "text": "Quelle est la position de la victime lors du relevage de sécurité ?",
    "answers": [
        {
            "text": "Assise",
            "isCorrect": true,
            "comment": "Réponse correcte : La position de la victime lors du relevage de sécurité est assise."
        },
        {
            "text": "Allongée sur le dos",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La victime est placée en position assise lors du relevage de sécurité."
        },
        {
            "text": "Allongée sur le ventre",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse. La position de la victime lors du relevage de sécurité est assise, pas allongée sur le ventre."
        },
        {
            text: "Debout",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. La victime est placée en position assise lors du relevage de sécurité, pas debout."
        }
    ]
},
{
    "text": "Quelles sont les actions à entreprendre avant le relevage de sécurité ?",
    "answers": [
        {
            text: "Ignorer les blessures de la victime pour ne pas aggraver sa douleur",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Il est important de prendre en compte les blessures de la victime lors du relevage de sécurité."
        },
        {
            text: "Vérifier la conscience de la victime et son état de respiration",
            isCorrect: true,
            comment: "Réponse correcte : Avant le relevage de sécurité, il est important de vérifier la conscience de la victime et son état de respiration."
        },
        {
            text: "Laisser la victime seule pour trouver de l'aide",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Il est crucial de rester auprès de la victime pour assurer sa sécurité avant le relevage de sécurité."
        },
        {
            text: "Appliquer immédiatement un collier cervical",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. L'application d'un collier cervical peut être nécessaire après le relevage de sécurité en fonction des blessures de la victime, mais ce n'est pas une étape préliminaire."
        }
    ]
},
{
    "text": "Comment doit être effectué le relevage de sécurité ?",
    "answers": [
        {
            text: "Rapidement pour éviter d'exposer la victime trop longtemps",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le relevage de sécurité doit être effectué avec précaution pour éviter d'aggraver les blessures de la victime."
        },
        {
            text: "En demandant à la victime de se relever elle-même",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Le relevage de sécurité est effectué par les secouristes pour protéger la victime et lui éviter tout mouvement excessif."
        },
        {
            text: "En maintenant la tête, le cou et le tronc en position alignée",
            isCorrect: true,
            comment: "Réponse correcte : Le relevage de sécurité doit être effectué en maintenant la tête, le cou et le tronc de la victime en position alignée pour limiter les risques de lésions supplémentaires."
        },
        {
            text: "En utilisant des mouvements brusques pour soulever la victime",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Les mouvements brusques peuvent aggraver les blessures de la victime. Le relevage doit être effectué de manière contrôlée et douce."
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
    "text": "Quel est le but de l'immobilisation d'une victime sur un brancard cuillère ?",
    "answers": [
        {
            text: "Limiter les mouvements de la victime",
            isCorrect: true,
            comment: "Réponse correcte : L'immobilisation sur un brancard cuillère vise à limiter les mouvements de la victime, ce qui est essentiel pour éviter d'aggraver les blessures, en particulier celles de la colonne vertébrale."
        },
        {
            text: "Faciliter le transport de la victime",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Bien que le brancard cuillère facilite le transport, son objectif principal est d'immobiliser la victime pour prévenir toute exacerbation des blessures."
        },
        {
            text: "Réduire la douleur de la victime",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. L'immobilisation sur un brancard cuillère n'a pas pour objectif principal de réduire la douleur, mais plutôt de limiter les mouvements pour éviter d'aggraver les blessures."
        },
        {
            text: "Permettre à la victime de se déplacer librement",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. L'immobilisation sur un brancard cuillère vise à restreindre les mouvements de la victime, pas à lui permettre de se déplacer librement."
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
    "text": "Qu'est-ce qu'un traumatisme du thorax ?",
    "answers": [
        {
            text: "Une blessure au niveau du bras",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Un traumatisme du thorax concerne spécifiquement cette région du corps."
        },
        {
            text: "Une blessure au niveau de l'abdomen",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Un traumatisme du thorax concerne spécifiquement la région de la cage thoracique, pas l'abdomen."
        },
        {
            text: "Une atteinte traumatique du thorax avec ou sans plaie",
            isCorrect: true,
            comment: "Réponse correcte : Un traumatisme du thorax se réfère à une atteinte traumatique de cette région du corps, avec ou sans plaie associée."
        },
        {
            text: "Une blessure au niveau de la tête",
            isCorrect: false,
            comment: "Ce n'est pas la bonne réponse. Un traumatisme du thorax concerne spécifiquement la région de la cage thoracique, pas la tête."
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
"text": "Quelle est la conduite à tenir devant une victime suspecte d'un traumatisme crânien et qui respire ?",
"answers": [
    {
        "text": "Appeler les secours et attendre leur arrivée",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de traumatisme crânien avec respiration préservée, il est essentiel d'appeler les secours et d'attendre leur arrivée."
    },
    {
        "text": "Immobiliser la victime",
        "isCorrect": false
    },
    {
        "text": "Administrer de l'oxygène en inhalation",
        "isCorrect": false
    },
    {
        "text": "Rien, car la victime respire",
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
"text": "Quels sont les signes d'une atteinte de la moelle épinière chez une victime présentant un traumatisme du dos ?",
"answers": [
    {
        "text": "Engourdissement et douleur au niveau de la colonne vertébrale",
        "isCorrect": false
    },
    {
        "text": "Perte de conscience et difficulté respiratoire",
        "isCorrect": false
    },
    {
        "text": "Perte ou diminution de la force musculaire et de la sensibilité des membres",
        "isCorrect": true,
        "comment": "Réponse correcte : Une atteinte de la moelle épinière peut se manifester par une perte ou une diminution de la force musculaire et de la sensibilité des membres chez une victime de traumatisme du dos."
    },
    {
        "text": "Douleur et raideur au niveau de la nuque",
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
"text": "Quelle est la première étape à effectuer en cas de suspicion de lésion du rachis chez une victime ?",
"answers": [
    {
        "text": "Demander à la victime de se relever",
        "isCorrect": false
    },
    {
        "text": "Immobiliser la tête et le cou de la victime",
        "isCorrect": true,
        "comment": "Réponse correcte : Il est essentiel d'immobiliser la tête et le cou pour prévenir d'autres dommages en cas de suspicion de lésion du rachis."
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
"text": "Quelle est la position recommandée pour une victime avec une atteinte au niveau d'un membre inférieur ?",
"answers": [
    {
        "text": "Position assise",
        "isCorrect": false
    },
    {
        "text": "Position allongée",
        "isCorrect": true,
        "comment": "Réponse correcte : Il est recommandé de placer la victime en position allongée en cas d'atteinte au niveau d'un membre inférieur."
    },
    {
        "text": "Position debout",
        "isCorrect": false
    },
    {
        "text": "Position inclinée",
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
"text": "Que faire si la victime a perdu connaissance après un traumatisme des membres ?",
"answers": [
    {
        "text": "La déplacer immédiatement",
        "isCorrect": false
    },
    {
        "text": "La laisser dans la position où elle se trouve",
        "isCorrect": false
    },
    {
        "text": "Appliquer une conduite à tenir spécifique",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de perte de connaissance après un traumatisme des membres, appliquer une conduite à tenir spécifique est nécessaire."
    },
    {
        "text": "Ne rien faire et attendre l'arrivée des secours",
        "isCorrect": false
    }
]
},
{
"text": "Quel est l'effet de l'immobilisation du membre blessé ?",
"answers": [
    {
        "text": "Aggravation de la douleur",
        "isCorrect": false
    },
    {
        "text": "Prévention de tout déplacement de la zone blessée",
        "isCorrect": true,
        "comment": "Réponse correcte : L'immobilisation prévient tout déplacement de la zone blessée."
    },
    {
        "text": "Augmentation de la mobilité",
        "isCorrect": false
    },
    {
        "text": "Diminution de la sensibilité",
        "isCorrect": false
    }
]
},
{
"text": "Que doit faire le secouriste en présence d'une fracture ouverte avec un saignement abondant ?",
"answers": [
    {
        "text": "Appliquer du froid sur la plaie",
        "isCorrect": false
    },
    {
        "text": "Immobiliser le membre blessé immédiatement",
        "isCorrect": false
    },
    {
        "text": "Appliquer la conduite à tenir face à une hémorragie externe avant toute immobilisation",
        "isCorrect": true,
        "comment": "Réponse correcte : Il est crucial d'appliquer la conduite à tenir face à une hémorragie externe avant toute immobilisation en cas de fracture ouverte avec saignement abondant."
    },
    {
        "text": "Réaligner la fracture pour arrêter le saignement",
        "isCorrect": false
    }
]
},
{
"text": "Que doit faire le secouriste si la victime présente une détresse vitale après un traumatisme ?",
"answers": [
    {
        "text": "Immobiliser le membre blessé",
        "isCorrect": false
    },
    {
        "text": "Appliquer une conduite à tenir adaptée à une détresse circulatoire",
        "isCorrect": true,
        "comment": "Réponse correcte : En cas de détresse vitale après un traumatisme, il faut appliquer une conduite à tenir adaptée à une détresse circulatoire."
    },
    {
        "text": "Appliquer du froid sur la lésion",
        "isCorrect": false
    },
    {
        "text": "Examiner la victime en détail",
        "isCorrect": false
    }
]
},
{
"text": "Quel est l'effet de l'application de froid sur une lésion ?",
"answers": [
    {
        "text": "Augmente le gonflement",
        "isCorrect": false
    },
    {
        "text": "Réduit la douleur",
        "isCorrect": true,
        "comment": "Réponse correcte : L'application de froid sur une lésion aide à réduire la douleur."
    },
    {
        "text": "Réaligne les os",
        "isCorrect": false
    },
    {
        "text": "Provoque des saignements",
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
