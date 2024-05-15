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
    {
        "text": "Qu'est-ce qui peut provoquer une détresse vitale lors d'un traumatisme de la face et du cou ?",
        "answers": [
            {
                "text": "Obstruction des voies aériennes",
                "isCorrect": true,
                "comment": "Réponse correcte : Une obstruction des voies aériennes peut entraîner une détresse respiratoire sévère lors d'un traumatisme de la face et du cou."
            },
            {
                "text": "Gonflement des paupières",
                "isCorrect": false,
                "comment": "Lors d'un traumatisme de la face et du cou, le gonflement des paupières peut être présent mais n'entraîne pas directement une détresse vitale."
            },
            {
                "text": "Douleur dentaire sévère",
                "isCorrect": false,
                "comment": "La douleur dentaire sévère, bien que douloureuse, ne constitue pas une cause directe de détresse vitale lors d'un traumatisme de la face et du cou."
            },
            {
                "text": "Fracture du bras",
                "isCorrect": false,
                "comment": "Une fracture du bras ne provoque pas de détresse vitale directe lors d'un traumatisme de la face et du cou."
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
        "text": "Que faire en cas de fracture de la mandibule avec détresse respiratoire ?",
        "answers": [
            {
                "text": "Rester en attente sans intervention",
                "isCorrect": false,
                "comment": "En cas de fracture de la mandibule avec détresse respiratoire, une intervention immédiate est nécessaire pour stabiliser la respiration de la victime."
            },
            {
                "text": "Installer la victime sur le ventre",
                "isCorrect": false,
                "comment": "Installer la victime sur le ventre peut aggraver la détresse respiratoire. Il est préférable de positionner la victime sur le côté pour aider à la respiration."
            },
            {
                "text": "Installer la victime sur le côté",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de fracture de la mandibule avec détresse respiratoire, il est important de positionner la victime sur le côté pour maintenir les voies respiratoires dégagées."
            },
            {
                "text": "Immobiliser les bras",
                "isCorrect": false,
                "comment": "L'immobilisation des bras n'est pas nécessaire en cas de détresse respiratoire due à une fracture de la mandibule."
            }
        ]
    },
    {
        "text": "Comment minimiser les mouvements des yeux en cas d'atteinte traumatique de l'œil ?",
        "answers": [
            {
                "text": "Demander à la victime de regarder autour",
                "isCorrect": false,
                "comment": "Demander à la victime de regarder autour peut aggraver les blessures oculaires en augmentant les mouvements des yeux. Il est préférable de limiter les mouvements oculaires en demandant à la victime de fermer les yeux et de rester allongée."
            },
            {
                "text": "Recouvrir les yeux avec des bandages serrés",
                "isCorrect": false,
                "comment": "Recouvrir les yeux avec des bandages serrés peut être excessif et peut aggraver les blessures oculaires. Il est préférable d'adopter une approche plus douce pour minimiser les mouvements des yeux."
            },
            {
                "text": "Demander à la victime de fermer les yeux et de rester allongée",
                "isCorrect": true,
                "comment": "Réponse correcte : En demandant à la victime de fermer les yeux et de rester allongée, on limite les mouvements oculaires et on favorise la protection des yeux blessés."
            },
            {
                "text": "Faire pivoter la tête de la victime",
                "isCorrect": false,
                "comment": "Pivoter la tête de la victime peut aggraver les blessures oculaires en provoquant des mouvements involontaires des yeux. Il est préférable de maintenir la tête stable."
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
        "text": "Que doit faire le secouriste si la victime perd connaissance ?",
        "answers": [
            {
                "text": "Attendre qu'elle reprenne conscience d'elle-même",
                "isCorrect": false,
                "comment": "Attendre que la victime reprenne conscience peut retarder les soins nécessaires. Il est important d'intervenir immédiatement en appliquant la conduite à tenir adaptée."
            },
            {
                "text": "Chercher à réveiller la victime en la secouant",
                "isCorrect": false,
                "comment": "Secouer la victime peut aggraver les blessures. Il est préférable d'adopter des techniques non invasives pour réveiller la victime."
            },
            {
                "text": "Appliquer la conduite à tenir adaptée",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de perte de conscience, il est essentiel d'appliquer immédiatement la conduite à tenir adaptée pour assurer la sécurité de la victime."
            },
            {
                "text": "Continuer à vérifier le pouls",
                "isCorrect": false,
                "comment": "Continuer à vérifier le pouls est important mais ne remplace pas la prise en charge immédiate en cas de perte de connaissance."
            }
        ]
    },
    {
        "text": "Quel risque est associé à une obstruction des voies aériennes lors d'un traumatisme de la face ?",
        "answers": [
            {
                "text": "Saignement nasal",
                "isCorrect": false,
                "comment": "Une obstruction des voies aériennes peut entraîner une détresse respiratoire mais n'est pas spécifiquement associée à des saignements nasaux."
            },
            {
                "text": "Détresse respiratoire",
                "isCorrect": true,
                "comment": "Réponse correcte : Une obstruction des voies aériennes peut entraîner une détresse respiratoire sévère, mettant la vie de la victime en danger."
            },
            {
                "text": "Fracture dentaire",
                "isCorrect": false,
                "comment": "Une obstruction des voies aériennes ne conduit pas directement à une fracture dentaire, bien que d'autres blessures puissent survenir lors du traumatisme."
            },
            {
                "text": "Douleur abdominale",
                "isCorrect": false,
                "comment": "La douleur abdominale n'est pas un symptôme directement associé à une obstruction des voies aériennes."
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
        "text": "Que faire si la victime présente une déformation de la face après un traumatisme ?",
        "answers": [
            {
                "text": "Ignorer la déformation si elle n'entrave pas la respiration",
                "isCorrect": false,
                "comment": "Une déformation de la face peut indiquer des blessures sous-jacentes graves. Il est crucial d'évaluer et de traiter toute déformation après un traumatisme."
            },
            {
                "text": "Demander à la victime de masser la zone déformée",
                "isCorrect": false,
                "comment": "Masser la zone déformée peut aggraver les blessures et causer des complications. Une évaluation professionnelle est nécessaire."
            },
            {
                "text": "Installer la victime en position assise",
                "isCorrect": false,
                "comment": "Installer la victime en position assise peut ne pas être approprié si des blessures graves sont suspectées. La position allongée est souvent recommandée."
            },
            {
                "text": "Appliquer la conduite à tenir face à une détresse vitale",
                "isCorrect": true,
                "comment": "Réponse correcte : En présence d'une déformation de la face après un traumatisme, il est essentiel d'appliquer immédiatement la conduite à tenir adaptée pour gérer la détresse vitale."
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
        "text": "Que doit faire le secouriste si la plaie est située au niveau du cou ?",
        "answers": [
            {
                "text": "Appliquer de la glace immédiatement",
                "isCorrect": false,
                "comment": "L'application de glace n'est pas recommandée pour les plaies au niveau du cou, car cela peut aggraver les blessures et causer des complications vasculaires."
            },
            {
                "text": "Maintenir la compression manuelle en comprimant la trachée",
                "isCorrect": false,
                "comment": "Comprimer la trachée peut entraîner une obstruction des voies respiratoires et n'est pas une méthode appropriée pour le contrôle du saignement au niveau du cou."
            },
            {
                "text": "Veiller à ne pas comprimer la trachée de la victime",
                "isCorrect": true,
                "comment": "Réponse correcte : Lors du traitement d'une plaie au niveau du cou, il est crucial de veiller à ne pas comprimer la trachée, ce qui pourrait compromettre les voies respiratoires."
            },
            {
                "text": "Retirer tous les corps étrangers visibles",
                "isCorrect": false,
                "comment": "Retirer les corps étrangers peut être nécessaire mais ne doit pas compromettre la respiration de la victime. La priorité est de contrôler le saignement sans obstruer les voies respiratoires."
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
        "text": "Quelle est la conduite à tenir si la victime présente une atteinte traumatique de l'œil ?",
        "answers": [
            {
                "text": "Demander à la victime de cligner des yeux rapidement",
                "isCorrect": false,
                "comment": "Demander à la victime de cligner des yeux rapidement peut aggraver les blessures oculaires. Il est préférable de minimiser les mouvements oculaires."
            },
            {
                "text": "Recouvrir les yeux avec des bandages serrés",
                "isCorrect": false,
                "comment": "Recouvrir les yeux avec des bandages serrés peut être excessif et peut aggraver les blessures oculaires. Il est préférable d'adopter une approche plus douce."
            },
            {
                "text": "Tenter de retirer tout corps étranger visible",
                "isCorrect": false,
                "comment": "Tenter de retirer les corps étrangers peut aggraver les blessures oculaires. Les manipulations oculaires doivent être effectuées par du personnel qualifié."
            },
            {
                "text": "Minimiser les mouvements des yeux et recouvrir les deux yeux avec des compresses stériles",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas d'atteinte traumatique de l'œil, il est important de minimiser les mouvements oculaires et de protéger les yeux avec des compresses stériles."
            }
        ]
    },
    {
        "text": "Que faire si le saignement causé par une fracture de la face est abondant ?",
        "answers": [
            {
                "text": "Ne rien faire, le saignement s'arrêtera naturellement",
                "isCorrect": false,
                "comment": "Un saignement abondant nécessite une intervention immédiate pour éviter les complications graves. La compression manuelle est souvent nécessaire."
            },
            {
                "text": "Installer la victime sur le dos",
                "isCorrect": false,
                "comment": "Installer la victime sur le dos peut aggraver le saignement en augmentant la pression sur la région blessée. La position latérale de sécurité est préférable."
            },
            {
                "text": "Appliquer une compression manuelle en tenant compte de la position de la trachée",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de saignement abondant, une compression manuelle en tenant compte de la position de la trachée est essentielle pour contrôler le saignement sans compromettre les voies respiratoires."
            },
            {
                "text": "Appliquer de la chaleur sur la zone blessée",
                "isCorrect": false,
                "comment": "L'application de chaleur peut aggraver le saignement. La compression manuelle est la méthode de contrôle du saignement la plus appropriée."
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
        "text": "Que faire si le saignement causé par une fracture de la face est abondant ?",
        "answers": [
            {
                "text": "Ne rien faire, le saignement s'arrêtera naturellement",
                "isCorrect": false,
                "comment": "Un saignement abondant nécessite une intervention immédiate pour éviter les complications graves. La compression manuelle est souvent nécessaire."
            },
            {
                "text": "Installer la victime sur le dos",
                "isCorrect": false,
                "comment": "Installer la victime sur le dos peut aggraver le saignement en augmentant la pression sur la région blessée. La position latérale de sécurité est préférable."
            },
            {
                "text": "Appliquer une compression manuelle en tenant compte de la position de la trachée",
                "isCorrect": true,
                "comment": "Réponse correcte : En cas de saignement abondant, une compression manuelle en tenant compte de la position de la trachée est essentielle pour contrôler le saignement sans compromettre les voies respiratoires."
            },
            {
                "text": "Appliquer de la chaleur sur la zone blessée",
                "isCorrect": false,
                "comment": "L'application de chaleur peut aggraver le saignement. La compression manuelle est la méthode de contrôle du saignement la plus appropriée."
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
        "text": "Quel est l'effet de la contention pelvienne sur les fractures du bassin ?",
        answers: [
          { "text": "Elle rapproche les fragments osseux et les immobilise.", isCorrect: true, comment: "Oui, la contention pelvienne vise à stabiliser les fractures du bassin." },
          { "text": "Elle augmente la mobilité des fragments osseux.", isCorrect: false, comment: "La contention pelvienne a pour objectif de limiter la mobilité des fragments osseux pour réduire les complications." },
          { "text": "Elle dissocie les fragments osseux pour faciliter le traitement.", isCorrect: false, comment: "La contention pelvienne cherche à stabiliser les fragments osseux." },
          { "text": "Elle n'a aucun effet sur les fractures du bassin.", isCorrect: false, comment: "La contention pelvienne est recommandée pour immobiliser les fractures du bassin." }
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
        "text": "Comment doit être positionnée la ceinture pelvienne par rapport aux grands trochanters de la victime ?",
        answers: [
          { "text": "Elle doit être centrée au niveau des grands trochanters.", isCorrect: true, comment: "Oui, la ceinture pelvienne doit être correctement positionnée pour assurer une contention efficace." },
          { "text": "Elle doit être positionnée au-dessus des grands trochanters.", isCorrect: false, comment: "La ceinture pelvienne doit être centrée pour stabiliser le bassin." },
          { "text": "Elle doit être positionnée en dessous des grands trochanters.", isCorrect: false, comment: "La contention pelvienne est plus efficace lorsqu'elle est centrée au niveau des grands trochanters." },
          { "text": "Elle doit être serrée autour des cuisses de la victime.", isCorrect: false, comment: "La ceinture pelvienne doit être centrée sur le bassin pour une contention efficace." }
        ]
      },
      {
        "text": "Quelle est la principale justification de l'utilisation d'une contention pelvienne chez une victime de traumatisme du bassin ?",
        answers: [
          { "text": "Elle permet de rapprocher les fragments osseux et d'immobiliser la région lésée.", isCorrect: true, comment: "Oui, la contention pelvienne vise à stabiliser le bassin et à limiter les complications." },
          { "text": "Elle réduit la douleur de la victime.", isCorrect: false, comment: "Bien que la contention pelvienne puisse aider à réduire la douleur, son objectif principal est la stabilisation du bassin." },
          { "text": "Elle empêche toute mobilité de la victime.", isCorrect: false, comment: "La contention pelvienne est spécifique à la stabilisation du bassin, pas à l'immobilité totale de la victime." },
          { "text": "Elle améliore la circulation sanguine dans la région lésée.", isCorrect: false, comment: "La contention pelvienne vise à limiter les saignements et à stabiliser le bassin." }
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
        "text": "Pour quels membres du corps peut-on utiliser une attelle à dépression en secourisme ?",
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
        "text": "Quel est le composant essentiel d'une attelle à dépression utilisée en secourisme ?",
        answers: [
          { "text": "Une enveloppe étanche à l'air contenant des billes de polystyrène expansé et une vanne d'admission d'air.", isCorrect: true, comment: "Exact, ces composants permettent de créer et de maintenir la dépression nécessaire à l'immobilisation du membre." },
          { "text": "Des sangles de maintien solides.", isCorrect: false, comment: "Les sangles sont importantes mais l'enveloppe étanche et la vanne d'admission d'air sont essentielles pour créer la dépression." },
          { "text": "Un dispositif de traction manuelle.", isCorrect: false, comment: "La traction n'est pas le principe de fonctionnement d'une attelle à dépression." },
          { "text": "Des supports rigides en plastique.", isCorrect: false, comment: "Une attelle à dépression utilise un matériau souple pour épouser la forme du membre blessé." }
        ]
      },
      {
        "text": "Quelle est la méthode de fonctionnement d'une attelle à dépression en secourisme ?",
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
          { "text": "Mobilisation du membre, douleur accrue et risque de complications.", isCorrect: true, comment: "Oui, une mauvaise immobilisation peut aggraver les blessures et augmenter les risques pour la victime." },
          { "text": "Diminution de la circulation sanguine dans le membre.", isCorrect: false, comment: "La mauvaise mise en place peut entraîner des complications, mais cela ne concerne pas directement la circulation sanguine." },
          { "text": "Augmentation de la douleur due à une compression excessive.", isCorrect: false, comment: "Une mauvaise immobilisation peut en effet aggraver la douleur mais pas uniquement en raison d'une compression excessive." },
          { "text": "Aucun risque n'est associé à une mauvaise mise en place d'une attelle à dépression.", isCorrect: false, comment: "Une mauvaise immobilisation peut avoir des conséquences néfastes pour la victime." }
        ]
      },
      {
        "text": "Quels critères indiquent une immobilisation correcte à l'aide d'une attelle à dépression ?",
        answers: [
          { "text": "Le segment blessé et les articulations sus et sous-jacentes sont immobilisés, l'attelle est correctement fixée, la douleur diminue et aucune compression excessive n'est présente.", isCorrect: true, comment: "Oui, ces critères indiquent une immobilisation efficace et sûre." },
          { "text": "La victime ne ressent aucune douleur après l'immobilisation.", isCorrect: false, comment: "La douleur peut diminuer mais cela seul ne garantit pas une immobilisation correcte." },
          { "text": "Une compression élevée est exercée autour du membre blessé.", isCorrect: false, comment: "Une immobilisation efficace n'implique pas une compression excessive." },
          { "text": "L'attelle est maintenue en place par des sangles solides.", isCorrect: false, comment: "La fixation de l'attelle est importante mais ne suffit pas à garantir une immobilisation correcte." }
        ]
      },
      {
        "text": "Quelle est la différence principale entre une attelle à dépression et une attelle classique en secourisme ?",
        answers: [
          { "text": "Une attelle à dépression utilise une enveloppe étanche à l'air pour créer une immobilisation rigide, tandis qu'une attelle classique utilise des matériaux rigides ou souples pour maintenir le membre en place.", isCorrect: true, comment: "Exact, l'attelle à dépression crée un environnement stable en retirant l'air à l'intérieur." },
          { "text": "Une attelle à dépression est plus confortable pour la victime.", isCorrect: false, comment: "Le confort peut varier mais la différence principale réside dans le mode d'immobilisation." },
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
        "text": "Que doit faire un secouriste pour créer le vide à l'intérieur d'une attelle à dépression ?",
        answers: [
          { "text": "Aspirer l'air à travers la vanne d'admission jusqu'à ce que l'attelle devienne rigide.", isCorrect: true, comment: "Oui, le vide est créé en retirant l'air à l'intérieur de l'attelle pour la rendre rigide et immobile." },
          { "text": "Injecter de l'air à l'intérieur de l'attelle jusqu'à ce qu'elle se solidifie.", isCorrect: false, comment: "Le vide est créé en retirant l'air, pas en ajoutant de l'air à l'intérieur de l'attelle." },
          { "text": "Régler les sangles de maintien pour renforcer l'immobilisation.", isCorrect: false, comment: "Les sangles servent à fixer l'attelle mais ne sont pas utilisées pour créer le vide." },
          { "text": "Chauffer l'attelle à dépression pour la rendre rigide.", isCorrect: false, comment: "Le vide est créé par l'extraction de l'air, pas par chauffage." }
        ]
      },
      {
        "text": "Quel est l'avantage principal de l'utilisation d'une attelle à dépression par rapport à une attelle classique en secourisme ?",
        answers: [
          { "text": "Elle peut créer une immobilisation rigide et confortable en épousant parfaitement la forme du membre blessé.", isCorrect: true, comment: "Oui, l'attelle à dépression offre une immobilisation plus personnalisée et efficace grâce à la dépression créée à l'intérieur." },
          { "text": "Elle est plus facile à mettre en place en cas d'urgence.", isCorrect: false, comment: "La facilité de mise en place peut varier mais la personnalisation de l'immobilisation est un avantage clé de l'attelle à dépression." },
          { "text": "Elle permet d'appliquer une pression élevée sur le membre blessé pour réduire l'enflure.", isCorrect: false, comment: "L'objectif n'est pas d'appliquer une pression élevée mais de créer une immobilisation stable sans compression excessive." },
          { "text": "Elle peut être utilisée sur tous les types de membres sans adaptation supplémentaire.", isCorrect: false, comment: "Une attelle à dépression peut être utilisée sur divers membres mais nécessite une adaptation selon le cas." }
        ]
      },
      {
        "text": "Quelle est la fonction des billes de polystyrène expansé à l'intérieur de l'enveloppe d'une attelle à dépression ?",
        answers: [
          { "text": "Elles s'adaptent à la forme du membre blessé pour créer une immobilisation personnalisée.", isCorrect: true, comment: "Oui, les billes permettent à l'attelle de s'adapter à la forme du membre pour une immobilisation efficace." },
          { "text": "Elles maintiennent l'attelle en place sur le membre sans bouger.", isCorrect: false, comment: "Les billes contribuent à l'adaptabilité de l'attelle mais ne sont pas directement liées à sa fixation." },
          { "text": "Elles renforcent la rigidité de l'attelle une fois le vide créé.", isCorrect: false, comment: "La rigidité est principalement due à la dépression créée à l'intérieur de l'attelle, pas aux billes elles-mêmes." },
          { "text": "Elles permettent de maintenir la pression d'air à l'intérieur de l'attelle pendant l'immobilisation.", isCorrect: false, comment: "Les billes contribuent à la personnalisation de l'immobilisation en épousant la forme du membre." }
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
        "text": "Quel est le rôle du secouriste 2 lors de la mise en place d'une attelle à dépression sur un membre inférieur ?",
        answers: [
          { "text": "Soulever le membre et glisser l'attelle en place sous la supervision du secouriste 3.", isCorrect: true, comment: "Oui, le secouriste 2 aide à placer l'attelle sous le membre et travaille en collaboration avec le secouriste 3." },
          { "text": "Faire le vide à l'intérieur de l'attelle une fois en place.", isCorrect: false, comment: "Le vide est réalisé après que l'attelle a été correctement positionnée sous le membre." },
          { "text": "Maintenir le membre blessé en place pendant la mise en place de l'attelle.", isCorrect: false, comment: "Le secouriste 1 est responsable de maintenir le membre pendant que le secouriste 2 place l'attelle." },
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
          { "text": "Mouvement non contrôlé du membre, douleur accrue et risque de complications.", isCorrect: true, comment: "Oui, une attelle mal positionnée peut aggraver les blessures et entraîner des complications pour la victime." },
          { "text": "Compression excessive du membre blessé.", isCorrect: false, comment: "Une attelle mal positionnée peut effectivement causer une compression excessive mais le risque principal est le mouvement non contrôlé du membre." },
          { "text": "Diminution de la circulation sanguine dans le membre.", isCorrect: false, comment: "La mauvaise position peut affecter la circulation mais le risque principal est le mouvement non contrôlé du membre." },
          { "text": "Aucun risque n'est associé à une mauvaise position d'une attelle à dépression.", isCorrect: false, comment: "Une attelle mal positionnée peut avoir des conséquences néfastes pour la victime." }
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
        "text": "Comment la vanne d'admission d'air contribue-t-elle à l'immobilisation avec une attelle à dépression ?",
        answers: [
          { "text": "Elle permet de créer et de maintenir la dépression nécessaire à l'immobilisation en régulant l'entrée et la sortie d'air.", isCorrect: true, comment: "Oui, la vanne joue un rôle crucial dans le contrôle de la pression d'air à l'intérieur de l'attelle." },
          { "text": "Elle maintient l'attelle en place sur le membre immobilisé.", isCorrect: false, comment: "La vanne contrôle la pression d'air mais n'affecte pas directement la fixation de l'attelle." },
          { "text": "Elle renforce la rigidité de l'attelle une fois mise en place.", isCorrect: false, comment: "La rigidité est principalement due à la dépression créée à l'intérieur de l'attelle, pas à la vanne elle-même." },
          { "text": "Elle permet de fixer l'attelle solidement autour du membre blessé.", isCorrect: false, comment: "La fixation de l'attelle est assurée par d'autres moyens ; la vanne contrôle la pression à l'intérieur de l'attelle." }
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
        "text": "Que doit faire le secouriste 1 lors de l'immobilisation de l'épaule avec une attelle à dépression ?",
        answers: [
          { "text": "Maintenir le membre blessé pendant que le secouriste 2 place l'attelle et l'écharpe.", isCorrect: true, comment: "Oui, le secouriste 1 est chargé de maintenir le membre dans une position stable pendant que l'attelle est placée." },
          { "text": "Faire le vide à l'intérieur de l'attelle une fois en place.", isCorrect: false, comment: "Le vide est créé après que l'attelle a été correctement positionnée sous le membre." },
          { "text": "Passer les sangles de maintien autour du membre après la mise en place de l'attelle.", isCorrect: false, comment: "Les sangles sont utilisées après que l'attelle a été correctement positionnée sous le membre." },
          { "text": "Régler la vanne d'admission d'air pour maintenir la pression à l'intérieur de l'attelle.", isCorrect: false, comment: "La vanne contrôle la pression d'air mais ne concerne pas directement la mise en place de l'attelle." }
        ]
      },
      {
        "text": "Quelle est l'indication principale pour l'utilisation d'une attelle modulable en secourisme ?",
        answers: [
          { "text": "Assurer l'immobilisation du coude, de l'avant-bras et du poignet pour le membre supérieur, et du genou, de la jambe et de la cheville pour le membre inférieur.", isCorrect: true, comment: "C'est exact, l'attelle modulable est utilisée pour immobiliser ces parties du corps en cas de traumatisme." },
          { "text": "Immobiliser uniquement le membre supérieur en cas de fracture.", isCorrect: false, comment: "L'attelle modulable peut également être utilisée pour le membre inférieur." },
          { "text": "Soutenir le cou en cas de blessure cervicale.", isCorrect: false, comment: "L'attelle modulable est principalement utilisée pour les membres, pas pour le cou." },
          { "text": "Prévenir les blessures musculaires.", isCorrect: false, comment: "L'attelle modulable est utilisée pour immobiliser en cas de traumatisme, pas pour prévenir des blessures musculaires." }
        ]
      },
      {
        "text": "Quel est l'objectif principal de l'immobilisation avec une attelle modulable en secourisme ?",
        answers: [
          { "text": "Limiter les mouvements d'un membre traumatisé, diminuer la douleur et prévenir les complications.", isCorrect: true, comment: "Oui, l'immobilisation vise à ces objectifs pour assurer un traitement efficace des traumatismes." },
          { "text": "Restreindre la circulation sanguine dans le membre blessé.", isCorrect: false, comment: "L'immobilisation ne vise pas à restreindre la circulation sanguine mais à limiter les mouvements et prévenir les complications." },
          { "text": "Faciliter le transport de la victime vers l'hôpital.", isCorrect: false, comment: "L'immobilisation est importante pour la stabilité du membre traumatisé mais ne concerne pas directement le transport." },
          { "text": "Réduire l'enflure autour de la blessure.", isCorrect: false, comment: "L'immobilisation aide à prévenir les complications mais ne vise pas spécifiquement à réduire l'enflure." }
        ]
      },
      {
        "text": "Quels sont les matériaux principaux utilisés dans une attelle modulable de type Aluform R ?",
        answers: [
          { "text": "Armature en aluminium, rembourrage en mousse, enveloppe en polystyrène, sangles autoagrippantes.", isCorrect: true, comment: "C'est correct, ces éléments composent une attelle modulable de type Aluform R." },
          { "text": "Acier inoxydable et plastique dur.", isCorrect: false, comment: "L'attelle Aluform R utilise principalement de l'aluminium et de la mousse, pas de l'acier." },
          { "text": "Bois et tissu élastique.", isCorrect: false, comment: "Les attelles modulables modernes utilisent des matériaux plus avancés comme l'aluminium et la mousse." },
          { "text": "Fibres de carbone et gel absorbant.", isCorrect: false, comment: "Ces matériaux ne sont pas couramment utilisés dans les attelles modulables standard." }
        ]
      },
      {
        "text": "Pourquoi est-il important d'effectuer un habillage préalable lors de l'utilisation d'une attelle de Kramer ?",
        answers: [
          { "text": "Pour rendre l'attelle moins traumatisante et éviter le contact direct du membre avec le métal.", isCorrect: true, comment: "Exact, l'habillage préalable est nécessaire pour le confort et la sécurité du patient." },
          { "text": "Pour maintenir la stabilité de l'attelle.", isCorrect: false, comment: "L'habillage vise à améliorer le confort du patient et à éviter les irritations de la peau." },
          { "text": "Pour renforcer la rigidité de l'attelle.", isCorrect: false, comment: "L'habillage préalable ne concerne pas la rigidité mais le confort du patient." },
          { "text": "Pour rendre l'attelle plus légère et facile à manipuler.", isCorrect: false, comment: "L'habillage préalable est principalement pour le confort du patient et non pour la manipulation de l'attelle." }
        ]
      },
      {
        "text": "Quel est le nombre minimum de secouristes nécessaires pour placer une attelle de Kramer correctement ?",
        answers: [
          { "text": "Deux secouristes au minimum.", isCorrect: true, comment: "Oui, deux secouristes sont généralement nécessaires pour manipuler et placer correctement une attelle de Kramer." },
          { "text": "Trois secouristes au minimum.", isCorrect: false, comment: "Deux secouristes sont suffisants pour placer une attelle de Kramer." },
          { "text": "Un secouriste seul peut le faire.", isCorrect: false, comment: "Une attelle de Kramer nécessite généralement deux personnes pour un placement correct." },
          { "text": "Quatre secouristes au minimum.", isCorrect: false, comment: "Deux secouristes sont généralement suffisants pour manipuler une attelle de Kramer." }
        ]
      },
      {
        "text": "Quel est le rôle du secouriste 1 lors de la mise en place d'une attelle modulable sur un membre supérieur ?",
        answers: [
          { "text": "Maintenir le membre blessé au niveau des articulations sus et sous-jacentes au traumatisme, éventuellement après réalignement, jusqu'à la mise en place de l'attelle.", isCorrect: true, comment: "Oui, le secouriste 1 est responsable de maintenir le membre dans une position stable avant et pendant la mise en place de l'attelle." },
          { "text": "Effectuer le vide à l'intérieur de l'attelle une fois en place.", isCorrect: false, comment: "Le vide est généralement effectué par un autre secouriste après la mise en place de l'attelle." },
          { "text": "Fixer l'attelle au membre blessé à l'aide de sangles autoagrippantes.", isCorrect: false, comment: "Ce rôle est généralement effectué par le secouriste 2." },
          { "text": "Préparer l'attelle adaptée à la situation.", isCorrect: false, comment: "La préparation de l'attelle est le rôle du secouriste 2." }
        ]
      },
      {
        "text": "Pourquoi est-il important de rembourrer les espaces libres entre l'attelle et le membre blessé lors de l'immobilisation ?",
        answers: [
          { "text": "Pour assurer un contact permanent entre l'attelle et le membre, garantissant ainsi une immobilisation efficace.", isCorrect: true, comment: "Oui, le rembourrage assure une immobilisation stable en évitant les mouvements indésirables." },
          { "text": "Pour renforcer la rigidité de l'attelle.", isCorrect: false, comment: "Le rembourrage n'affecte pas la rigidité mais le confort et la stabilité de l'immobilisation." },
          { "text": "Pour rendre l'attelle plus légère.", isCorrect: false, comment: "Le rembourrage vise à améliorer le confort et l'efficacité de l'immobilisation, pas à réduire le poids de l'attelle." },
          { "text": "Pour empêcher l'attelle de bouger pendant le transport.", isCorrect: false, comment: "Le rembourrage vise à stabiliser l'attelle contre le membre blessé, pas à prévenir les mouvements pendant le transport." }
        ]
      },
      {
        "text": "Quelle est la fonction principale des sangles autoagrippantes sur une attelle modulable ?",
        answers: [
          { "text": "Fixer l'attelle solidement autour du membre blessé.", isCorrect: true, comment: "Oui, les sangles autoagrippantes sont utilisées pour assurer une fixation solide de l'attelle sur le membre." },
          { "text": "Contrôler la pression à l'intérieur de l'attelle.", isCorrect: false, comment: "Les sangles autoagrippantes servent à maintenir l'attelle en place, pas à contrôler la pression interne." },
          { "text": "Améliorer le confort du patient.", isCorrect: false, comment: "Les sangles autoagrippantes sont principalement pour la fixation de l'attelle, pas pour le confort." },
          { "text": "Maintenir la rigidité de l'attelle une fois en place.", isCorrect: false, comment: "La rigidité est principalement assurée par la structure de l'attelle et le rembourrage, pas par les sangles." }
        ]
      },
      {
        "text": "Que doit vérifier le secouriste 2 après avoir fixé une attelle modulable sur un membre supérieur ?",
        answers: [
          { "text": "La qualité de l'immobilisation et l'état de l'extrémité du membre.", isCorrect: true, comment: "Exact, le secouriste doit s'assurer que l'immobilisation est correcte et que l'extrémité du membre est en bon état." },
          { "text": "La pression interne de l'attelle.", isCorrect: false, comment: "La pression interne est contrôlée avant la fixation de l'attelle." },
          { "text": "La rigidité de l'attelle.", isCorrect: false, comment: "La rigidité est vérifiée lors de la mise en place de l'attelle, pas après la fixation." },
          { "text": "La température du membre.", isCorrect: false, comment: "La température n'est pas une préoccupation directe lors de la fixation de l'attelle." }
        ]
      },
      {
        "text": "Quelle partie du membre est immobilisée par une attelle à traction pneumatique de Donway ?",
        answers: [
          { "text": "Les traumatismes de la cuisse et des 2/3 supérieurs de la jambe.", isCorrect: true, comment: "Correct, cette attelle est utilisée pour l'immobilisation de cette partie du membre." },
          { "text": "Les traumatismes du genou et du pied.", isCorrect: false, comment: "Cette attelle vise à immobiliser des zones plus hautes du membre inférieur." },
          { "text": "Les traumatismes de la cheville et du pied.", isCorrect: false, comment: "Une attelle à traction n'est pas adaptée pour les traumatismes du pied ou de la cheville." },
          { "text": "Les fractures du bassin et de la colonne vertébrale.", isCorrect: false, comment: "Ces types de fractures nécessitent d'autres approches et ne conviennent pas à cette attelle." }
        ]
      },
      {
        "text": "Dans quelles circonstances une attelle à traction ne peut-elle pas être utilisée ?",
        answers: [
          { "text": "Si les deux membres inférieurs sont atteints (préférer alors le MID), s'il existe un traumatisme de la cheville ou du pied, s'il existe un traumatisme du bassin ou de la partie inférieure du dos.", isCorrect: true, comment: "Exact, ces situations nécessitent d'autres types d'immobilisation ou de traitements." },
          { "text": "Si le membre est trop long pour l'attelle.", isCorrect: false, comment: "La longueur du membre n'est pas un facteur déterminant pour l'utilisation de cette attelle." },
          { "text": "Si le traumatisme est situé dans la partie inférieure de la jambe uniquement.", isCorrect: false, comment: "L'attelle à traction peut être utilisée pour les traumatismes de la partie supérieure de la jambe." },
          { "text": "Si le patient est conscient et capable de bouger le membre blessé.", isCorrect: false, comment: "L'utilisation d'une attelle à traction dépend du type de traumatisme et des recommandations médicales, pas seulement de la capacité du patient à bouger." }
        ]
      },
      {
        "text": "Quel est l'objectif principal de l'immobilisation avec une attelle à traction ?",
        answers: [
          { "text": "Limite les mouvements du membre traumatisé, diminue la douleur et prévient la survenue de complications.", isCorrect: true, comment: "Oui, l'immobilisation vise à ces objectifs pour un traitement efficace des traumatismes." },
          { "text": "Maintenir le membre dans une position confortable.", isCorrect: false, comment: "L'objectif principal est de limiter les mouvements et de réduire la douleur, pas seulement de fournir du confort." },
          { "text": "Permettre au patient de se déplacer malgré la blessure.", isCorrect: false, comment: "L'immobilisation vise à restreindre les mouvements pour permettre une guérison efficace." },
          { "text": "Augmenter la circulation sanguine dans le membre traumatisé.", isCorrect: false, comment: "L'attelle vise à limiter les mouvements pour éviter d'aggraver la blessure, pas à augmenter la circulation sanguine." }
        ]
      },
      {
        "text": "Quel est le rôle de la partie supérieure de l'attelle à traction de Donway ?",
        answers: [
          { "text": "Elle soutient la cuisse à l'aide de sangles et forme un anneau de blocage du bassin.", isCorrect: true, comment: "Oui, la partie supérieure de l'attelle à traction soutient la cuisse et assure la stabilité du bassin." },
          { "text": "Elle exerce une traction directe sur la jambe blessée.", isCorrect: false, comment: "La traction est exercée par la partie inférieure de l'attelle, pas par la partie supérieure." },
          { "text": "Elle maintient le pied en place avec une semelle rigide.", isCorrect: false, comment: "Le maintien du pied est assuré par la partie inférieure de l'attelle." },
          { "text": "Elle permet de gonfler l'attelle à l'aide de la pompe.", isCorrect: false, comment: "La partie supérieure ne contrôle pas le gonflage de l'attelle." }
        ]
      },
      {
        "text": "Comment est exercée la traction sur le membre traumatisé avec une attelle à traction pneumatique de Donway ?",
        answers: [
          { "text": "Par des vérins contrôlés par la pression créée par la pompe reliée au tube creux constituant le 'U'.", isCorrect: true, comment: "Oui, la traction est contrôlée par la pression exercée sur les vérins de l'attelle." },
          { "text": "Par des ressorts situés dans la partie supérieure de l'attelle.", isCorrect: false, comment: "La traction est contrôlée par des vérins, pas par des ressorts." },
          { "text": "Par un système hydraulique alimenté par la pompe manuelle.", isCorrect: false, comment: "La traction n'est pas effectuée par un système hydraulique dans ce cas." },
          { "text": "Par une pression exercée manuellement par les secouristes.", isCorrect: false, comment: "La traction est contrôlée par la pompe et les vérins intégrés à l'attelle." }
        ]
      },
      {
        "text": "Combien de secouristes sont nécessaires au minimum pour la mise en place d'une attelle à traction de Donway ?",
        answers: [
          { "text": "Trois secouristes.", isCorrect: true, comment: "Oui, au moins trois secouristes sont requis pour la mise en place de cette attelle." },
          { "text": "Deux secouristes.", isCorrect: false, comment: "Trois secouristes sont nécessaires pour manipuler correctement l'attelle à traction." },
          { "text": "Un secouriste.", isCorrect: false, comment: "Un seul secouriste ne suffit pas pour assurer une mise en place sécurisée de cette attelle." },
          { "text": "Cinq secouristes.", isCorrect: false, comment: "Trois secouristes sont normalement suffisants pour cette tâche." }
        ]
      },
      {
        "text": "Quel est le rôle du secouriste 3 dans la mise en place d'une attelle à traction ?",
        answers: [
          { "text": "Réaliser le maintien du bassin.", isCorrect: true, comment: "Oui, le secouriste 3 est chargé de maintenir le bassin pendant la mise en place de l'attelle." },
          { "text": "Préparer l'attelle adaptée à la situation.", isCorrect: false, comment: "La préparation de l'attelle est le rôle du secouriste 2." },
          { "text": "Assurer la traction sur le membre blessé.", isCorrect: false, comment: "La traction est contrôlée par le système intégré à l'attelle, pas par le secouriste 3." },
          { "text": "Vérifier la qualité de l'immobilisation une fois l'attelle en place.", isCorrect: false, comment: "La vérification de l'immobilisation est une tâche partagée par tous les secouristes impliqués." }
        ]
      },
      {
        "text": "Pourquoi l'attelle à traction ne peut-elle être installée que sur un membre réaligné ?",
        answers: [
          { "text": "Pour assurer une traction efficace et sûre sans aggraver le traumatisme.", isCorrect: true, comment: "Exact, l'alignement du membre est essentiel pour une traction correcte et sans risque." },
          { "text": "Pour rendre la procédure plus rapide.", isCorrect: false, comment: "L'alignement du membre est crucial pour éviter d'aggraver les lésions existantes." },
          { "text": "Pour permettre une meilleure visibilité de la blessure.", isCorrect: false, comment: "L'alignement du membre n'est pas lié à la visibilité de la blessure, mais à la sécurité de la procédure." },
          { "text": "Pour faciliter l'application des sangles de fixation.", isCorrect: false, comment: "L'alignement du membre vise à éviter les complications lors de l'immobilisation." }
        ]
      },
      {
        "text": "Que fait la soupape de sécurité sur une attelle à traction en cas de pression excessive ?",
        answers: [
          { "text": "Elle libère automatiquement la pression excédentaire pour éviter tout risque pour le patient.", isCorrect: true, comment: "Oui, la soupape de sécurité assure la sécurité du patient en cas de surpression." },
          { "text": "Elle augmente la pression pour renforcer l'immobilisation.", isCorrect: false, comment: "La soupape de sécurité agit pour prévenir les risques liés à une pression excessive." },
          { "text": "Elle verrouille la pression pour maintenir la traction constante.", isCorrect: false, comment: "La soupape de sécurité agit dans le sens contraire pour éviter les risques liés à une pression excessive." },
          { "text": "Elle permet aux secouristes de contrôler manuellement la traction.", isCorrect: false, comment: "La soupape de sécurité agit de manière automatique pour assurer la sécurité du patient." }
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
        "text": "Quel est l'élément clé contrôlant la traction exercée par une attelle à traction pneumatique de Donway ?",
        answers: [
          { "text": "La pression créée par la pompe sur les vérins intégrés à l'attelle.", isCorrect: true, comment: "Oui, la pression contrôle la force de traction appliquée par l'attelle." },
          { "text": "La longueur des barres métalliques de l'attelle.", isCorrect: false, comment: "La longueur des barres n'affecte pas directement la traction exercée par l'attelle." },
          { "text": "Le type de matériau utilisé pour la partie supérieure de l'attelle.", isCorrect: false, comment: "Le matériau n'a pas d'incidence directe sur le contrôle de la traction." },
          { "text": "Le nombre de sangles utilisées pour fixer l'attelle.", isCorrect: false, comment: "Les sangles servent à fixer l'attelle, mais elles ne contrôlent pas la traction." }
        ]
      },
      {
        "text": "Pourquoi une attelle à traction ne peut-elle pas être installée sans la demande et la présence d'un médecin ?",
        answers: [
          { "text": "Pour garantir la sécurité et éviter les complications dues à une mauvaise utilisation.", isCorrect: true, comment: "Oui, l'installation d'une attelle à traction nécessite une expertise médicale pour assurer son efficacité et sa sécurité." },
          { "text": "Pour accélérer le processus d'immobilisation.", isCorrect: false, comment: "La présence d'un médecin est nécessaire pour des raisons de sécurité et de supervision médicale." },
          { "text": "Pour obtenir une autorisation officielle avant d'utiliser l'attelle.", isCorrect: false, comment: "La présence du médecin garantit une utilisation appropriée de l'attelle, mais ne nécessite pas d'autorisation spécifique." },
          { "text": "Pour permettre au médecin de surveiller la progression de l'immobilisation.", isCorrect: false, comment: "La supervision médicale est cruciale pour garantir l'efficacité et la sécurité de l'immobilisation." }
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
        "text": "Quel est le rôle de la partie inférieure en 'U' sur une attelle à traction pneumatique de Donway ?",
        answers: [
          { "text": "Elle soutient la jambe blessée et permet l'application de la traction contrôlée par la pompe.", isCorrect: true, comment: "Oui, la partie inférieure de l'attelle soutient la jambe et contrôle la traction exercée sur le membre blessé." },
          { "text": "Elle maintient la cuisse en place avec des sangles de fixation.", isCorrect: false, comment: "Le maintien de la cuisse est assuré par la partie supérieure de l'attelle." },
          { "text": "Elle absorbe les chocs en cas de mouvement involontaire.", isCorrect: false, comment: "La partie inférieure de l'attelle n'est pas conçue pour absorber les chocs, mais pour supporter la jambe et appliquer la traction." },
          { "text": "Elle contrôle la pression exercée par la pompe sur le membre blessé.", isCorrect: false, comment: "La pression est contrôlée par la partie supérieure de l'attelle, pas par la partie inférieure." }
        ]
      },
      {
        "text": "Combien de barres métalliques constituent la partie supérieure d'une attelle à traction de Donway ?",
        answers: [
          { "text": "Deux barres métalliques.", isCorrect: true, comment: "Oui, la partie supérieure de l'attelle est constituée de deux barres métalliques." },
          { "text": "Trois barres métalliques.", isCorrect: false, comment: "La partie supérieure est composée de deux barres métalliques." },
          { "text": "Une barre métallique.", isCorrect: false, comment: "La partie supérieure de l'attelle comporte deux barres métalliques pour soutenir la cuisse et le bassin." },
          { "text": "Quatre barres métalliques.", isCorrect: false, comment: "Deux barres métalliques forment la partie supérieure de l'attelle à traction." }
        ]
      },
      {
        "text": "Qu'est-ce qui déclenche l'application d'une traction contrôlée sur le membre blessé avec une attelle à traction de Donway ?",
        answers: [
          { "text": "La pression exercée par la pompe sur les vérins intégrés à l'attelle.", isCorrect: true, comment: "Oui, la traction est contrôlée par la pression appliquée via la pompe sur les vérins de l'attelle." },
          { "text": "La manipulation manuelle de l'attelle par les secouristes.", isCorrect: false, comment: "La traction est contrôlée par le système intégré à l'attelle, pas par les secouristes." },
          { "text": "Le serrage des sangles de fixation.", isCorrect: false, comment: "Les sangles de fixation servent à maintenir l'attelle en place mais ne contrôlent pas la traction." },
          { "text": "Le mouvement du patient.", isCorrect: false, comment: "La traction est appliquée de manière contrôlée par le dispositif de l'attelle, pas par le mouvement du patient." }
        ]
      },
      {
        "text": "Quelle est la principale fonction de la traverse métallique fixe sur l'attelle à traction de Donway ?",
        answers: [
          { "text": "Elle supporte la semelle du pied et assure la stabilité de la jambe.", isCorrect: true, comment: "Oui, la traverse métallique fixe soutient la jambe et la semelle du pied pour stabiliser le membre blessé." },
          { "text": "Elle contrôle la pression exercée sur la jambe.", isCorrect: false, comment: "La pression est contrôlée par d'autres composants de l'attelle, pas par la traverse métallique fixe." },
          { "text": "Elle permet la fixation des sangles de la partie inférieure de l'attelle.", isCorrect: false, comment: "La fixation des sangles est réalisée par d'autres éléments de l'attelle." },
          { "text": "Elle assure le confort du patient pendant l'immobilisation.", isCorrect: false, comment: "La traverse métallique fixe n'est pas conçue pour le confort, mais pour la stabilité et le support du membre blessé." }
        ]
      },
      {
        "text": "Quel rôle joue la large sangle réglable dans la partie inférieure de l'attelle à traction de Donway ?",
        answers: [
          { "text": "Elle soutient la jambe blessée et contribue à appliquer la traction sur le membre.", isCorrect: true, comment: "Oui, la sangle réglable soutient la jambe et participe à l'application de la traction." },
          { "text": "Elle maintient la cuisse en place avec des sangles de fixation.", isCorrect: false, comment: "La cuisse est maintenue par la partie supérieure de l'attelle, pas par la sangle réglable de la partie inférieure." },
          { "text": "Elle contrôle la pression exercée sur la jambe.", isCorrect: false, comment: "La pression est contrôlée par d'autres composants de l'attelle, pas par la sangle réglable." },
          { "text": "Elle permet de gonfler l'attelle à l'aide de la pompe.", isCorrect: false, comment: "La pompe est utilisée pour contrôler la traction, pas pour gonfler l'attelle." }
        ]
      },
      {
        "text": "Quel est le rôle de la pompe et du manomètre sur une attelle à traction pneumatique de Donway ?",
        answers: [
          { "text": "Ils contrôlent et surveillent la pression de la traction exercée sur le membre blessé.", isCorrect: true, comment: "Oui, la pompe et le manomètre servent à contrôler et surveiller la pression de traction appliquée par l'attelle." },
          { "text": "Ils fixent l'attelle en place sur le membre blessé.", isCorrect: false, comment: "La fixation de l'attelle est assurée par d'autres composants de l'attelle, pas par la pompe ou le manomètre." },
          { "text": "Ils contrôlent la température de l'attelle pendant son utilisation.", isCorrect: false, comment: "Le contrôle de la température n'est pas une fonction de la pompe ou du manomètre sur cette attelle." },
          { "text": "Ils facilitent le gonflage de l'attelle pour l'immobilisation.", isCorrect: false, comment: "La pompe est utilisée pour contrôler la traction, pas pour gonfler l'attelle." }
        ]
      },
      {
        "text": "Quelle est la fonction des deux barres supérieures d'une attelle à traction de Donway lors de son application ?",
        answers: [
          { "text": "Elles réalisent deux vérins qui appliquent une traction contrôlée par la pression de la pompe.", isCorrect: true, comment: "Oui, les barres supérieures de l'attelle servent à appliquer une traction contrôlée sur le membre blessé." },
          { "text": "Elles maintiennent le membre en place pendant l'immobilisation.", isCorrect: false, comment: "Le maintien du membre est assuré par d'autres parties de l'attelle, pas par les barres supérieures." },
          { "text": "Elles absorbent les chocs en cas de mouvement involontaire.", isCorrect: false, comment: "Les barres supérieures ne sont pas conçues pour absorber les chocs, mais pour appliquer la traction." },
          { "text": "Elles contrôlent la pression exercée sur le membre blessé.", isCorrect: false, comment: "La pression est contrôlée par d'autres composants de l'attelle, pas par les barres supérieures." }
        ]
      },
      {
        "text": "Qu'est-ce qui est régulé par la sangle soutenant la cuisse dans la partie supérieure de l'attelle à traction de Donway ?",
        answers: [
          { "text": "L'anneau de blocage du bassin.", isCorrect: true, comment: "Oui, la sangle soutenant la cuisse participe à la stabilisation et au blocage du bassin pendant l'immobilisation." },
          { "text": "La pression exercée sur la jambe.", isCorrect: false, comment: "La pression est contrôlée par d'autres composants de l'attelle, pas par la sangle soutenant la cuisse." },
          { "text": "La position de la jambe pendant l'immobilisation.", isCorrect: false, comment: "La position est déterminée par d'autres parties de l'attelle, pas par la sangle soutenant la cuisse." },
          { "text": "Le confort du patient pendant l'immobilisation.", isCorrect: false, comment: "La sangle soutenant la cuisse vise à stabiliser le bassin et le membre pendant l'immobilisation, pas à fournir du confort." }
        ]
      },
      {
        "text": "Pourquoi la partie inférieure en 'U' de l'attelle à traction de Donway est-elle creuse ?",
        answers: [
          { "text": "Pour permettre le positionnement de la jambe blessée et le passage de la traverse métallique fixe.", isCorrect: true, comment: "Oui, la partie inférieure creuse de l'attelle permet de loger le membre et les composants de traction pour une application sécurisée." },
          { "text": "Pour absorber les chocs en cas de mouvement involontaire.", isCorrect: false, comment: "La partie inférieure n'est pas conçue pour absorber les chocs, mais pour soutenir le membre et appliquer la traction." },
          { "text": "Pour permettre l'écoulement de l'air pendant l'utilisation de l'attelle.", isCorrect: false, comment: "La conception creuse vise à loger correctement le membre et les composants de traction, pas à faciliter l'écoulement de l'air." },
          { "text": "Pour faciliter le transport et le stockage de l'attelle.", isCorrect: false, comment: "La conception creuse vise à optimiser l'immobilisation du membre, pas le transport ou le stockage de l'attelle." }
        ]
      },
      {
        "text": "Quel est l'objectif principal de la partie inférieure de l'attelle à traction de Donway ?",
        answers: [
          { "text": "Soutenir la jambe blessée et permettre l'application de la traction contrôlée.", isCorrect: true, comment: "Oui, la partie inférieure de l'attelle soutient le membre et applique la traction pour l'immobilisation efficace du membre." },
          { "text": "Maintenir la cuisse en place avec des sangles de fixation.", isCorrect: false, comment: "Le maintien de la cuisse est assuré par la partie supérieure de l'attelle, pas par la partie inférieure." },
          { "text": "Contrôler la pression exercée sur la jambe.", isCorrect: false, comment: "La pression est contrôlée par d'autres composants de l'attelle, pas par la partie inférieure." },
          { "text": "Absorber les chocs en cas de mouvement involontaire.", isCorrect: false, comment: "La partie inférieure n'est pas conçue pour absorber les chocs, mais pour soutenir le membre et appliquer la traction." }
        ]
      },
      {
        "text": "Que permettent de réaliser les deux barres supérieures de l'attelle à traction de Donway une fois engagées dans les branches creuses de la partie inférieure en 'U' ?",
        answers: [
          { "text": "Deux vérins qui appliquent une traction contrôlée sur le membre blessé.", isCorrect: true, comment: "Oui, les barres supérieures engagées dans la partie inférieure forment des vérins qui permettent de contrôler la traction sur le membre blessé." },
          { "text": "Un verrouillage sécurisé de la jambe blessée.", isCorrect: false, comment: "Les barres supérieures servent à appliquer la traction contrôlée, pas à verrouiller la jambe." },
          { "text": "Un système de gonflage pour stabiliser la jambe.", isCorrect: false, comment: "Le système de gonflage est contrôlé par d'autres composants de l'attelle, pas par les barres supérieures." },
          { "text": "Une fixation solide du membre pendant l'immobilisation.", isCorrect: false, comment: "La fixation du membre est assurée par l'ensemble de l'attelle, pas seulement par les barres supérieures." }
        ]
      },
      {
        "text": "Pourquoi l'attelle à traction pneumatique de Donway est-elle dotée d'une soupape de sécurité ?",
        answers: [
          { "text": "Pour libérer automatiquement la pression excédentaire en cas de surpression.", isCorrect: true, comment: "Oui, la soupape de sécurité assure la sécurité du patient en cas de surpression lors de l'immobilisation." },
          { "text": "Pour réguler la pression exercée sur le membre blessé.", isCorrect: false, comment: "La pression est régulée par d'autres composants de l'attelle, pas par la soupape de sécurité." },
          { "text": "Pour renforcer la traction sur le membre.", isCorrect: false, comment: "La soupape de sécurité agit pour éviter les risques liés à une pression excessive, pas pour renforcer la traction." },
          { "text": "Pour contrôler le gonflage de l'attelle pendant son utilisation.", isCorrect: false, comment: "La pompe contrôle le gonflage de l'attelle, pas la soupape de sécurité." }
        ]
      },
      {
        "text": "Quel est le principal rôle de la sangle réglable dans la partie inférieure de l'attelle à traction de Donway ?",
        answers: [
          { "text": "Soutenir la jambe blessée et participer à l'application de la traction contrôlée.", isCorrect: true, comment: "Oui, la sangle réglable soutient la jambe et participe à l'application de la traction pour immobiliser efficacement le membre." },
          { "text": "Maintenir la cuisse en place avec des sangles de fixation.", isCorrect: false, comment: "Le maintien de la cuisse est assuré par la partie supérieure de l'attelle, pas par la sangle réglable de la partie inférieure." },
          { "text": "Contrôler la pression exercée sur la jambe.", isCorrect: false, comment: "La pression est contrôlée par d'autres composants de l'attelle, pas par la sangle réglable." },
          { "text": "Absorber les chocs en cas de mouvement involontaire.", isCorrect: false, comment: "La sangle réglable n'est pas conçue pour absorber les chocs, mais pour soutenir le membre et appliquer la traction." }
        ]
      },
      {
          "text": "Quand est-il nécessaire d'utiliser une immobilisation du membre supérieur au moyen d'écharpes ?",
          answers: [
              { "text": "Lorsque des moyens plus appropriés ne sont pas disponibles pour mobiliser la victime.", isCorrect: true, comment: "Effectivement, les écharpes sont utilisées quand d'autres moyens d'immobilisation ne sont pas disponibles." },
              { "text": "Uniquement en cas de fractures graves du membre supérieur.", isCorrect: false, comment: "Les écharpes peuvent être utilisées plus largement que pour les fractures graves, lorsque d'autres moyens ne sont pas disponibles." },
              { "text": "En présence de complications circulatoires graves.", isCorrect: false, comment: "Les écharpes ne sont pas spécifiquement réservées aux complications circulatoires, mais plutôt à l'immobilisation générale du membre supérieur." },
              { "text": "Pour des traitements médicaux avancés du membre supérieur.", isCorrect: false, comment: "Les écharpes servent principalement à l'immobilisation et ne sont pas liées à des traitements médicaux avancés." }
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
          "text": "Quel matériau est utilisé pour fabriquer une écharpe triangulaire utilisée dans l'immobilisation du membre supérieur ?",
          answers: [
              { "text": "Coton, toile ou papier non-tissé.", isCorrect: true, comment: "Oui, ces matériaux sont utilisés pour fabriquer des écharpes triangulaires." },
              { "text": "Métal et plastique rigide.", isCorrect: false, comment: "Ces matériaux ne sont pas utilisés pour les écharpes triangulaires dans ce contexte." },
              { "text": "Verre et céramique.", isCorrect: false, comment: "Ces matériaux ne sont adaptés pour les écharpes triangulaires en raison de leur rigidité." },
              { "text": "Caoutchouc et silicone.", isCorrect: false, comment: "Ces matériaux ne sont pas utilisés pour les écharpes triangulaires dans ce contexte." }
          ]
      },
      {
          "text": "Comment doit être positionné le sommet d'une écharpe triangulaire lors de l'immobilisation du membre supérieur ?",
          answers: [
              { "text": "Du côté du coude.", isCorrect: true, comment: "Oui, le sommet de l'écharpe doit être du côté du coude pour une immobilisation efficace." },
              { "text": "Du côté de l'épaule opposée au membre blessé.", isCorrect: false, comment: "Le sommet doit être du côté du coude pour une immobilisation correcte." },
              { "text": "Au niveau de la main.", isCorrect: false, comment: "Le sommet de l'écharpe doit être plus haut, du côté du coude." },
              { "text": "Au niveau du poignet.", isCorrect: false, comment: "Le sommet de l'écharpe doit être plus haut, du côté du coude." }
          ]
      },
      {
          "text": "Quelle est la longueur minimale recommandée pour la base d'une écharpe triangulaire utilisée dans l'immobilisation du membre supérieur ?",
          answers: [
              { "text": "1,2 mètres.", isCorrect: true, comment: "Oui, la longueur minimale recommandée pour la base de l'écharpe triangulaire est de 1,2 mètres." },
              { "text": "1 mètre.", isCorrect: false, comment: "La longueur minimale recommandée est légèrement supérieure à 1 mètre." },
              { "text": "2 mètres.", isCorrect: false, comment: "La longueur recommandée est moindre que 2 mètres." },
              { "text": "0,5 mètres.", isCorrect: false, comment: "La longueur recommandée est significativement plus grande que 0,5 mètres." }
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
      "text": "Qu'est-ce qu'un plan dur en secourisme ?",
      answers: [
        { "text": "Un outil rigide utilisé pour l'immobilisation et le transfert de victimes en cas de traumatisme du rachis.", isCorrect: true, comment: "Exact, le plan dur est un dispositif rigide essentiel en cas de suspicion de traumatisme du rachis." },
        { "text": "Une méthode de secourisme utilisée en cas de situation critique.", isCorrect: false, comment: "Ce n'est pas la définition précise d'un plan dur en secourisme." },
        { "text": "Un protocole de prise en charge des blessés sur le terrain.", isCorrect: false, comment: "Cela ne définit pas spécifiquement ce qu'est un plan dur en secourisme." },
        { "text": "Un dispositif pour transporter les victimes par hélicoptère.", isCorrect: false, comment: "Cette définition ne correspond pas à celle d'un plan dur." }
      ]
  },
  {
      "text": "Quelle est la longueur approximative d'un plan dur utilisé en secourisme ?",
      answers: [
        { "text": "Environ 1,85 mètres.", isCorrect: true, comment: "C'est correct, un plan dur standard mesure environ 1,85 mètres de longueur." },
        { "text": "Environ 2 mètres.", isCorrect: false, comment: "Ce n'est pas la longueur typique d'un plan dur utilisé en secourisme." },
        { "text": "Environ 1 mètre.", isCorrect: false, comment: "Cette longueur est insuffisante pour un plan dur utilisé en secourisme." },
        { "text": "Environ 3 mètres.", isCorrect: false, comment: "Ce serait une longueur excessive pour un plan dur utilisé en secourisme." }
      ]
  },
  {
      "text": "Quel matériau constitue un plan dur utilisé en secourisme ?",
      answers: [
        { "text": "PVC radiotransparent et résistant à l'eau.", isCorrect: true, comment: "Exact, un plan dur en secourisme est généralement fabriqué en PVC radiotransparent pour la résistance à l'eau." },
        { "text": "Bois robuste et imperméable.", isCorrect: false, comment: "Le bois n'est pas couramment utilisé pour les plans durs en secourisme." },
        { "text": "Aluminium léger et flexible.", isCorrect: false, comment: "L'aluminium n'est pas le matériau typique pour un plan dur utilisé en secourisme." },
        { "text": "Acier inoxydable résistant.", isCorrect: false, comment: "L'acier inoxydable n'est pas couramment utilisé pour les plans durs en secourisme." }
      ]
  },
  {
      "text": "Quelles sont les caractéristiques importantes d'un plan dur en secourisme ?",
      answers: [
        { "text": "Rigidité, radiotransparence, résistance à l'eau.", isCorrect: true, comment: "Ces caractéristiques sont essentielles pour un plan dur en secourisme." },
        { "text": "Flexibilité et légèreté.", isCorrect: false, comment: "Un plan dur doit être rigide plutôt que flexible pour l'immobilisation." },
        { "text": "Opacité et légèreté.", isCorrect: false, comment: "L'opacité n'est pas une caractéristique souhaitable pour un plan dur en secourisme." },
        { "text": "Flexibilité et opacité.", isCorrect: false, comment: "Un plan dur en secourisme doit être rigide et radiotransparent." }
      ]
  },
  {
      "text": "À quoi sert l'immobilisateur de tête utilisé avec un plan dur en secourisme ?",
      answers: [
        { "text": "À limiter les mouvements de la tête et du cou en cas de suspicion de traumatisme du rachis.", isCorrect: true, comment: "Exact, l'immobilisateur de tête est crucial pour prévenir les lésions de la colonne cervicale." },
        { "text": "À soutenir la victime pendant le transport.", isCorrect: false, comment: "Cette réponse ne décrit pas correctement le rôle de l'immobilisateur de tête." },
        { "text": "À fournir un confort supplémentaire à la victime.", isCorrect: false, comment: "Le rôle principal de l'immobilisateur de tête est la sécurité, pas le confort." },
        { "text": "À maintenir la victime éveillée.", isCorrect: false, comment: "L'immobilisateur de tête n'est pas utilisé pour maintenir la victime éveillée." }
      ]
  },
  {
      "text": "Comment est constitué l'immobilisateur de tête utilisé avec un plan dur en secourisme ?",
      answers: [
        { "text": "D'un coussin de tête, de blocs d'immobilisation latéraux et de sangles de fixation frontale et mentonnière.", isCorrect: true, comment: "C'est exact, l'immobilisateur de tête est composé de plusieurs éléments pour assurer la stabilité de la tête et du cou." },
        { "text": "D'une seule bande de maintien autour de la tête.", isCorrect: false, comment: "Un seul élément ne suffit pas pour un bon maintien de la tête en cas de traumatisme du rachis." },
        { "text": "D'un dispositif en mousse uniquement.", isCorrect: false, comment: "La mousse seule ne fournit pas suffisamment de soutien pour l'immobilisation de la tête." },
        { "text": "D'une ceinture abdominale et de sangles thoraciques.", isCorrect: false, comment: "Ce type de dispositif est utilisé pour d'autres types de maintien mais pas spécifiquement pour l'immobilisation de la tête." }
      ]
  },
  {
      "text": "Pourquoi utilise-t-on un plan dur avec un immobilisateur de tête en secourisme ?",
      answers: [
        { "text": "Pour limiter les mouvements de la tête et du cou en cas de suspicion de traumatisme du rachis.", isCorrect: true, comment: "Exact, cette combinaison est cruciale pour éviter d'aggraver les lésions de la colonne cervicale." },
        { "text": "Pour maintenir la victime en position debout.", isCorrect: false, comment: "Cette réponse ne décrit pas correctement l'utilisation d'un plan dur avec un immobilisateur de tête." },
        { "text": "Pour protéger la victime du froid.", isCorrect: false, comment: "L'utilisation principale d'un plan dur avec un immobilisateur de tête est liée à l'immobilisation en cas de traumatisme du rachis." },
        { "text": "Pour faciliter le transfert vers un brancard.", isCorrect: false, comment: "Le but principal n'est pas seulement le transfert mais l'immobilisation de la tête et du cou." }
      ]
  },
  {
      "text": "Quelle est l'utilité principale du plan dur en secourisme ?",
      answers: [
        { "text": "Immobiliser et transférer les victimes en cas de suspicion de traumatisme du rachis.", isCorrect: true, comment: "C'est la fonction principale du plan dur dans les interventions d'urgence." },
        { "text": "Maintenir les secouristes stables sur le terrain.", isCorrect: false, comment: "Bien que la stabilité soit importante, ce n'est pas le rôle principal d'un plan dur en secourisme." },
        { "text": "Servir de support pour l'administration de premiers soins.", isCorrect: false, comment: "Un plan dur est utilisé pour l'immobilisation plutôt que pour l'administration de premiers soins." },
        { "text": "Protéger les victimes des intempéries.", isCorrect: false, comment: "Ce n'est pas la principale utilité d'un plan dur en secourisme." }
      ]
  },
  {
      "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "La technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la méthode recommandée lorsque le brancard cuillère n'est pas disponible." },
        { "text": "La technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est utilisée si d'autres techniques ne peuvent pas être réalisées." },
        { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas recommandée pour transférer une victime sur un plan dur." },
        { "text": "La technique du levage direct sur le plan dur.", isCorrect: false, comment: "Cette méthode peut être risquée sans l'utilisation appropriée d'équipement." }
      ]
  },
  {
      "text": "Quelle est la procédure à suivre pour installer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Utiliser la technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la procédure recommandée pour transférer une victime sur un plan dur sans brancard cuillère." },
        { "text": "Utiliser la technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est une alternative si le pont à quatre porteurs n'est pas possible." },
        { "text": "Utiliser la technique du levage direct sur le plan dur.", isCorrect: false, comment: "Le levage direct peut être dangereux sans équipement approprié." },
        { "text": "Utiliser un brancard souple pour le transfert sur le plan dur.", isCorrect: false, comment: "Un brancard souple n'est pas recommandé pour le transfert sur un plan dur en l'absence de brancard cuillère." }
      ]
  },
  {
      "text": "Quelle est la priorité lors de l'installation d'une victime sur un plan dur en secourisme ?",
      answers: [
        { "text": "Maintenir l'axe tête-cou-tronc de la victime.", isCorrect: true, comment: "C'est la priorité principale pour éviter d'aggraver une éventuelle lésion de la colonne vertébrale." },
        { "text": "S'assurer que la victime est confortable.", isCorrect: false, comment: "Le confort n'est pas la priorité principale lors de l'installation sur un plan dur en secourisme." },
        { "text": "S'assurer que la victime est consciente.", isCorrect: false, comment: "La conscience de la victime est importante mais ce n'est pas la priorité principale lors de l'installation sur un plan dur." },
        { "text": "Vérifier la température corporelle de la victime.", isCorrect: false, comment: "La température corporelle n'est pas la priorité lors de l'installation sur un plan dur." }
      ]
  },
  {
      "text": "Combien d'intervenants sont nécessaires pour installer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Trois intervenants.", isCorrect: true, comment: "Trois intervenants sont nécessaires pour effectuer cette procédure efficacement." },
        { "text": "Deux intervenants.", isCorrect: false, comment: "Deux intervenants ne seraient pas suffisants pour cette procédure spécifique." },
        { "text": "Quatre intervenants.", isCorrect: false, comment: "Quatre intervenants seraient excessifs pour cette procédure." },
        { "text": "Un seul intervenant.", isCorrect: false, comment: "Un seul intervenant ne peut pas réaliser cette procédure de manière sûre et efficace." }
      ]
  },
  {
      "text": "Quel est le rôle du premier secouriste lors de l'installation d'une victime sur un plan dur en secourisme ?",
      answers: [
        { "text": "Maintenir la tête de la victime pendant toute la manœuvre.", isCorrect: true, comment: "Le premier secouriste est responsable de maintenir la tête de la victime stable pendant la procédure." },
        { "text": "Coordonner les secouristes pour transporter la victime.", isCorrect: false, comment: "Le rôle du premier secouriste est spécifique à maintenir la stabilité de la tête de la victime." },
        { "text": "Observer les signes vitaux de la victime.", isCorrect: false, comment: "Les signes vitaux sont importants mais ce n'est pas le rôle principal du premier secouriste dans cette procédure." },
        { "text": "Assurer le confort de la victime pendant le transfert.", isCorrect: false, comment: "Le confort de la victime n'est pas le rôle principal du premier secouriste lors de cette procédure." }
      ]
  },
  {
      "text": "Quelle est la position de la victime pendant l'installation sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Allongée sur le dos.", isCorrect: true, comment: "C'est la position de base pour cette procédure d'installation sur un plan dur." },
        { "text": "Allongée sur le ventre.", isCorrect: false, comment: "Cette position n'est pas utilisée pour l'installation sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Debout.", isCorrect: false, comment: "La victime ne serait pas debout pendant cette procédure d'installation sur un plan dur." },
        { "text": "Assise.", isCorrect: false, comment: "La position assise n'est pas utilisée pour cette procédure." }
      ]
  },
  {
      "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le ventre sur un plan dur en secourisme ?",
      answers: [
        { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
        { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
        { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Cette méthode n'est pas recommandée sans équipement adéquat." },
        { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas utilisé pour cette procédure." }
      ]
  },
  {
      "text": "Quelle est la position de la victime pendant le transfert sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
        { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
      ]
  },
  {
      "text": "Quelle est la procédure recommandée pour transférer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
        { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
        { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas approprié pour cette procédure." },
        { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Le levage direct n'est pas recommandé pour cette procédure." }
      ]
  },
  {
      "text": "Quel est le rôle du troisième secouriste lors du transfert sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Assurer le guidage et le maintien de la victime pendant le transfert.", isCorrect: true, comment: "Le troisième secouriste est chargé de guider et de maintenir la victime en position pendant le transfert." },
        { "text": "Maintenir la tête et le cou de la victime.", isCorrect: false, comment: "Le maintien de la tête et du cou est généralement effectué par le premier secouriste." },
        { "text": "Assurer la sécurité autour de la zone de transfert.", isCorrect: false, comment: "La sécurité de la zone est importante mais ce n'est pas le rôle principal du troisième secouriste pendant le transfert." },
        { "text": "Effectuer les premiers gestes de secours à la victime.", isCorrect: false, comment: "Les premiers gestes de secours sont effectués avant le transfert sur un plan dur." }
      ]
  },
  {
      "text": "Quelle est la position de la victime lorsqu'elle est prête pour le transfert final sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
        { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert final sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
      ]
  },
  {
      "text": "Quelle est la technique appropriée pour transférer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "La technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime sur un plan dur sans brancard cuillère." },
        { "text": "La technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est une alternative si le pont à quatre porteurs n'est pas possible." },
        { "text": "La technique du levage direct sur le plan dur.", isCorrect: false, comment: "Le levage direct peut être dangereux sans équipement approprié." },
        { "text": "La technique du retournement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas recommandé pour le transfert sur un plan dur en l'absence de brancard cuillère." }
      ]
  },
  {
      "text": "Quelle est la procédure pour installer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Utiliser la technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la procédure appropriée pour installer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère." },
        { "text": "Utiliser la technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour installer une victime allongée sur le ventre sur un plan dur." },
        { "text": "Utiliser la technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas approprié pour cette procédure." },
        { "text": "Utiliser la technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Le levage direct n'est pas recommandé pour cette procédure." }
      ]
  },
  {
      "text": "Quel est le rôle du premier secouriste lors de l'installation d'une victime sur un plan dur en l'absence de brancard cuillère en secourisme ?",
      answers: [
        { "text": "Maintenir la tête de la victime pendant toute la manœuvre.", isCorrect: true, comment: "Le premier secouriste est responsable de maintenir la tête de la victime stable pendant la procédure." },
        { "text": "Coordonner les secouristes pour transporter la victime.", isCorrect: false, comment: "Le rôle du premier secouriste est spécifique à maintenir la stabilité de la tête de la victime." },
        { "text": "Observer les signes vitaux de la victime.", isCorrect: false, comment: "Les signes vitaux sont importants mais ce n'est pas le rôle principal du premier secouriste dans cette procédure." },
        { "text": "Assurer le confort de la victime pendant le transfert.", isCorrect: false, comment: "Le confort de la victime n'est pas le rôle principal du premier secouriste lors de cette procédure." }
      ]
  },
      {
          "text": "Quelle est la procédure pour installer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "Utiliser la technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la procédure appropriée pour installer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Utiliser la technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour installer une victime allongée sur le ventre sur un plan dur." },
            { "text": "Utiliser la technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas approprié pour cette procédure." },
            { "text": "Utiliser la technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Le levage direct n'est pas recommandé pour cette procédure." }
          ]
      },
      {
          "text": "Quel est le rôle du premier secouriste lors de l'installation d'une victime sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "Maintenir la tête de la victime pendant toute la manœuvre.", isCorrect: true, comment: "Le premier secouriste est responsable de maintenir la tête de la victime stable pendant la procédure." },
            { "text": "Coordonner les secouristes pour transporter la victime.", isCorrect: false, comment: "Le rôle du premier secouriste est spécifique à maintenir la stabilité de la tête de la victime." },
            { "text": "Observer les signes vitaux de la victime.", isCorrect: false, comment: "Les signes vitaux sont importants mais ce n'est pas le rôle principal du premier secouriste dans cette procédure." },
            { "text": "Assurer le confort de la victime pendant le transfert.", isCorrect: false, comment: "Le confort de la victime n'est pas le rôle principal du premier secouriste lors de cette procédure." }
          ]
      },
      {
          "text": "Quelle est la position de la victime pendant l'installation sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "Allongée sur le dos.", isCorrect: true, comment: "C'est la position de base pour cette procédure d'installation sur un plan dur." },
            { "text": "Allongée sur le ventre.", isCorrect: false, comment: "Cette position n'est pas utilisée pour l'installation sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Debout.", isCorrect: false, comment: "La victime ne serait pas debout pendant cette procédure d'installation sur un plan dur." },
            { "text": "Assise.", isCorrect: false, comment: "La position assise n'est pas utilisée pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le ventre sur un plan dur en secourisme ?",
          answers: [
            { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Cette méthode n'est pas recommandée sans équipement adéquat." },
            { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas utilisé pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la position de la victime pendant le transfert sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
            { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
          ]
      },
      {
          "text": "Quelle est la procédure recommandée pour transférer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas approprié pour cette procédure." },
            { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Le levage direct n'est pas recommandé pour cette procédure." }
          ]
      },




//POSE PROBLEME


      {
          "text": "Quelle est la position de la victime pendant l'installation sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "Allongée sur le dos.", isCorrect: true, comment: "C'est la position de base pour cette procédure d'installation sur un plan dur." },
            { "text": "Allongée sur le ventre.", isCorrect: false, comment: "Cette position n'est pas utilisée pour l'installation sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Debout.", isCorrect: false, comment: "La victime ne serait pas debout pendant cette procédure d'installation sur un plan dur." },
            { "text": "Assise.", isCorrect: false, comment: "La position assise n'est pas utilisée pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la technique recommandée pour transférer une victime allongée sur le ventre sur un plan dur en secourisme ?",
          answers: [
            { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
            { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Cette méthode n'est pas recommandée sans équipement adéquat." },
            { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas utilisé pour cette procédure." }
          ]
      },
      {
          "text": "Quelle est la position de la victime pendant le transfert sur un plan dur en l'absence de brancard cuillère en secourisme ?",
          answers: [
            { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
            { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
            { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
          ]
      },
          {
              "text": "Quelle est la procédure recommandée pour transférer une victime allongée sur le ventre sur un plan dur en l'absence de brancard cuillère en secourisme ?",
              answers: [
                { "text": "La technique du retournement de la victime en utilisant un pont à trois porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
                { "text": "La technique du roulement de la victime au sol à deux secouristes.", isCorrect: false, comment: "Cette méthode n'est pas appropriée pour transférer une victime allongée sur le ventre sur un plan dur." },
                { "text": "La technique du roulement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas approprié pour cette procédure." },
                { "text": "La technique du levage direct de la victime sur le plan dur.", isCorrect: false, comment: "Le levage direct n'est pas recommandé pour cette procédure." }
              ]
          },
          {
              "text": "Quel est le rôle du troisième secouriste lors du transfert sur un plan dur en l'absence de brancard cuillère en secourisme ?",
              answers: [
                { "text": "Assurer le guidage et le maintien de la victime pendant le transfert.", isCorrect: true, comment: "Le troisième secouriste est chargé de guider et de maintenir la victime en position pendant le transfert." },
                { "text": "Maintenir la tête et le cou de la victime.", isCorrect: false, comment: "Le maintien de la tête et du cou est généralement effectué par le premier secouriste." },
                { "text": "Assurer la sécurité autour de la zone de transfert.", isCorrect: false, comment: "La sécurité de la zone est importante mais ce n'est pas le rôle principal du troisième secouriste pendant le transfert." },
                { "text": "Effectuer les premiers gestes de secours à la victime.", isCorrect: false, comment: "Les premiers gestes de secours sont effectués avant le transfert sur un plan dur." }
              ]
          },
          {
              "text": "Quelle est la position de la victime lorsqu'elle est prête pour le transfert final sur un plan dur en l'absence de brancard cuillère en secourisme ?",
              answers: [
                { "text": "Sur le côté, perpendiculairement au sol.", isCorrect: true, comment: "C'est la position finale recommandée pour le transfert d'une victime allongée sur le dos sur un plan dur." },
                { "text": "Sur le dos, parallèlement au sol.", isCorrect: false, comment: "Cette position n'est pas appropriée pour le transfert final sur un plan dur en l'absence de brancard cuillère." },
                { "text": "Sur le ventre, perpendiculairement au sol.", isCorrect: false, comment: "Le transfert sur le ventre n'est pas réalisé sur un plan dur en l'absence de brancard cuillère." },
                { "text": "Sur le dos, perpendiculairement au sol.", isCorrect: false, comment: "Cette position n'est pas recommandée pour le transfert final sur un plan dur." }
              ]
          },
          {
              "text": "Quelle est la technique appropriée pour transférer une victime allongée sur le dos sur un plan dur en l'absence de brancard cuillère en secourisme ?",
              answers: [
                { "text": "La technique du pont à quatre porteurs.", isCorrect: true, comment: "C'est la méthode appropriée pour transférer une victime sur un plan dur sans brancard cuillère." },
                { "text": "La technique du roulement de la victime au sol à trois secouristes.", isCorrect: false, comment: "Cette méthode est une alternative si le pont à quatre porteurs n'est pas possible." },
                { "text": "La technique du levage direct sur le plan dur.", isCorrect: false, comment: "Le levage direct peut être dangereux sans équipement approprié." },
                { "text": "La technique du retournement de la victime en utilisant un brancard souple.", isCorrect: false, comment: "Un brancard souple n'est pas recommandé pour le transfert sur un plan dur en l'absence de brancard cuillère." }
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
