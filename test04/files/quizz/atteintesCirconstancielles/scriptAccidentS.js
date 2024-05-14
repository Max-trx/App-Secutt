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
    "text": "Qu’elle est la défnition d'une gelure ?",
    answers: [
      { text: "Un saignement qui ne s'arrête pas", isCorrect: false, comment: "Ce n'est pas Une gelure est une lésion grave de la peau liée au froid." },
      { text: "Une lésion grave de la peau liée au froid", isCorrect: true, comment: "Une gelure est en effet une lésion de la peau causée par le froid." },
      { text: "Une douleur des cervicales", isCorrect: false, comment: "Non, ce n'est pas une gelure. Il s'agit d'autre chose." },
      { text: "Une douleur des cervicales", isCorrect: false, comment: "Non, ce n'est pas une gelure. Il s'agit d'autre chose." }
    ]
  },
  {
    "text": "Dans quelle(s) condition(s) surviennent les gelures ?",
    answers: [
      { text: "Lors d’une exposition prolongée dans un milieu froid, en dessous de 0°C", isCorrect: true },
      { text: "Lors d’une exposition de 5 min dans un milieu froid -10°C", isCorrect: false },
      { text: "Lors ce que je vais dans un milieu chaud", isCorrect: false },
      { text: "Lors ce que je vais dans un milieu chaud", isCorrect: false }
    ]
  },
  {
    "text": "Combien de degré de gelure existe-il ?",
    answers: [
      { text: "3 sachant que dans le cas le plus grave il y a un risque d’amputation", isCorrect: false },
      { text: "4 et l’apparition des 1er cloques s’effectue au 3eme degré", isCorrect: true },
      { text: "4 et l’apparition des cloques sanglantes se manifeste au 3eme degré", isCorrect: false },
      { text: "4 et l’amputation est irréversible dans le pire cas", isCorrect: false }
    ]
  },
  {
    "text": "Sous quelles conditions pouvons-nous plonger les gelures dans une bassine d’eau à 37-39°C ?",
    answers: [
      { text: "Uniquement sous 10h", isCorrect: false },
      { text: "Uniquement sous 24h", isCorrect: false },
      { text: "S’il n’y a pas de risque de réexposition au froid", isCorrect: true },
      { text: "Pas plus de 20min immergées", isCorrect: false }
    ]
  },
  {
      "text": "Pourquoi est-il important de repérer la présence d'une poche d'air lors du dégagement de la tête de la victime ensevelie ?",
      answers: [
          {
              text: "Pour décider si la victime doit être évacuée rapidement",
              isCorrect: false,
              comment: "L'évaluation de la poche d'air est importante pour adapter la conduite à tenir, mais cela ne détermine pas nécessairement la nécessité d'une évacuation rapide."
          },
          {
              text: "Pour évaluer l'ampleur des lésions traumatiques",
              isCorrect: false,
              comment: "Bien que l'évaluation des lésions soit importante, la présence d'une poche d'air est plus pertinente pour fournir une ventilation efficace."
          },
          {
              text: "Pour déterminer si la victime est encore consciente",
              isCorrect: false,
              comment: "La présence d'une poche d'air n'est pas nécessairement liée à la conscience de la victime. Elle est importante pour fournir de l'oxygène si nécessaire."
          },
          {
              text: "Pour adapter la conduite à tenir et fournir de l'oxygène si nécessaire",
              isCorrect: true,
              comment: "Repérer une poche d'air permet d'adapter la prise en charge de la victime et de fournir de l'oxygène pour prévenir l'asphyxie."
          }
      ]
  },
  {
      "text": "Quel est l'un des mécanismes de traumatismes subis par une victime ensevelie dans une avalanche ?",
      answers: [
          {
              text: "L'écrasement par la neige compacte",
              isCorrect: false,
              comment: "L'écrasement est un mécanisme de traumatisme, mais les chocs contre des obstacles comme les rochers ou les arbres sont également fréquents."
          },
          {
              text: "La déshydratation due à l'exposition prolongée",
              isCorrect: false,
              comment: "La déshydratation peut être un problème, mais les traumatismes physiques sont plus immédiats et graves dans les premières minutes après l'avalanche."
          },
          {
              text: "Les brûlures causées par le frottement avec la neige",
              isCorrect: false,
              comment: "Les brûlures sont peu probables dans une avalanche. Les traumatismes sont généralement dus à des chocs contre des obstacles ou à l'asphyxie."
          },
          {
              text: "Les chocs directs contre les rochers ou les arbres",
              isCorrect: true,
              comment: "Les chocs contre des obstacles solides comme les rochers ou les arbres sont l'un des principaux mécanismes de traumatismes dans les avalanches."
          }
      ]
  },
  {
    "text": "Qu'est-ce que l'électrisation ?",
    "answers": [
        {
            text: "L'ensemble des lésions provoquées par le passage d'un courant électrique à travers le corps.",
            "isCorrect": true,
            "comment": "L'électrisation désigne en effet l'ensemble des lésions causées par le passage du courant électrique à travers le corps."
        },
        {
            text: "Un accident lié à la production d'un arc électrique.",
            "isCorrect": false,
            "comment": "Ce type d'accident est différent et n'est pas spécifiquement appelé électrisation."
        },
        {
            text: "L'effet direct du courant électrique lorsqu'il traverse les tissus.",
            "isCorrect": false,
            "comment": "C'est une partie de l'électrisation, mais pas sa définition complète."
        },
        {
            text: "Toutes les réponses précédentes sont correctes.",
            "isCorrect": false,
            "comment": "Seule la première réponse est correcte pour définir l'électrisation."
        }
    ]
},

{
    "text": "Qu'est-ce que l'électrocution ?",
    "answers": [
        {
            text: "Une électrisation mortelle.",
            "isCorrect": true,
            "comment": "L'électrocution désigne une électrisation mortelle."
        },
        {
            text: "Une électrisation temporaire.",
            "isCorrect": false,
            "comment": "L'électrocution n'est pas temporaire, c'est une condition mortelle."
        },
        {
            text: "Une électrisation due à la production d'un arc électrique.",
            "isCorrect": false,
            "comment": "L'électrocution ne se limite pas à la production d'un arc électrique."
        },
        {
            text: "Une électrisation provoquée par un courant continu.",
            "isCorrect": false,
            "comment": "L'électrocution n'est pas spécifiquement liée à un type particulier de courant électrique."
        }
    ]
},

{
    "text": "Quel est le nombre estimé d'accidents mortels d'origine électrique en France chaque année ?",
    "answers": [
        {
            text: "Environ 50",
            "isCorrect": false,
            "comment": "Ce nombre est plus élevé que cela."
        },
        {
            text: "Environ 200",
            "isCorrect": false,
            "comment": "Ce nombre est encore plus élevé."
        },
        {
            text: "Environ 1000",
            "isCorrect": false,
            "comment": "Ce nombre est excessivement élevé pour les accidents électriques mortels en France."
        },
        {
            text: "Environ 100",
            "isCorrect": true,
            "comment": "Environ 100 accidents mortels d'origine électrique sont estimés chaque année en France."
        }
    ]
},

{
    "text": "Quelle est la barrière la plus résistante face au courant électrique ?",
    "answers": [
        {
            "text": "Les nerfs.",
            "isCorrect": false,
            "comment": "Les nerfs ne sont pas une barrière efficace contre le courant électrique."
        },
        {
            "text": "Les vaisseaux sanguins.",
            "isCorrect": false,
            "comment": "Les vaisseaux sanguins ne constituent pas une barrière efficace contre le courant électrique."
        },
        {
            "text": "La peau.",
            "isCorrect": true,
            "comment": "La peau est la barrière la plus résistante face au courant électrique."
        },
        {
            "text": "Le liquide amniotique.",
            "isCorrect": false,
            "comment": "Le liquide amniotique n'est pas une barrière face au courant électrique chez une personne enceinte."
        }
    ]
},

{
    "text": "À quelle intensité de courant électrique commence-t-on à ressentir des picotements ?",
    "answers": [
        {
            "text": "1 mA",
            "isCorrect": true,
            "comment": "À partir d'environ 1 mA, on peut commencer à ressentir des picotements dus au courant électrique."
        },
        {
            "text": "10 mA",
            "isCorrect": false,
            "comment": "Cette intensité est plus élevée que celle à laquelle on commence à ressentir des picotements."
        },
        {
            "text": "30 mA",
            "isCorrect": false,
            "comment": "Cette intensité est encore plus élevée que celle à laquelle on commence à ressentir des picotements."
        },
        {
            "text": "100 mA",
            "isCorrect": false,
            "comment": "Cette intensité est beaucoup plus élevée que celle à laquelle on commence à ressentir des picotements."
        }
    ]
},

{
    "text": "Quels types d'accidents électriques peuvent survenir en France ?",
    "answers": [
        {
            "text": "Uniquement des accidents domestiques.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents domestiques."
        },
        {
            "text": "Accidents du travail, domestiques, de loisirs, dus à des conduites à risque et foudroiement.",
            "isCorrect": true,
            "comment": "Les accidents électriques en France peuvent inclure des accidents du travail, domestiques, de loisirs, dus à des conduites à risque et le foudroiement."
        },
        {
            "text": "Uniquement des accidents liés à des conduites à risque.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents liés à des conduites à risque."
        },
        {
            "text": "Uniquement des accidents de loisirs.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents de loisirs."
        }
    ]
},

{
    "text": "Qu'est-ce que l'action de secours doit permettre lors d'un accident électrique ?",
    "answers": [
        {
            "text": "Réparer les câbles endommagés.",
            "isCorrect": false,
            "comment": "La réparation des câbles endommagés est une tâche pour les professionnels de l'électricité, pas pour les secouristes."
        },
        {
            "text": "Prendre des photos des blessures.",
            "isCorrect": false,
            "comment": "Prendre des photos des blessures peut être utile à des fins médicales, mais ce n'est pas l'objectif principal de l'action de secours lors d'un accident électrique."
        },
        {
            "text": "Obtenir un avis médical, réaliser les gestes de secours adaptés et prendre en charge les brûlures.",
            "isCorrect": true,
            "comment": "L'action de secours lors d'un accident électrique doit permettre d'obtenir un avis médical, de réaliser les gestes de secours adaptés et de prendre en charge les brûlures."
        },
        {
            "text": "Aucune des réponses précédentes.",
            "isCorrect": false,
            "comment": "La dernière option est incorrecte car l'action de secours doit comprendre plusieurs mesures pour aider la victime."
        }
    ]
},


{
    "text": "Que doit faire un intervenant secouriste lorsqu'une victime est en contact avec un conducteur endommagé ?",
    "answers": [
        {
            "text": "S'approcher immédiatement de la victime.",
            "isCorrect": false,
            "comment": "S'approcher immédiatement de la victime peut mettre en danger l'intervenant lui-même en cas de danger électrique."
        },
        {
            "text": "Couper le courant si possible.",
            "isCorrect": true,
            "comment": "La première action à entreprendre est de couper le courant si cela est possible pour sécuriser la zone et éviter de nouvelles victimes."
        },
        {
            "text": "Toucher la victime pour vérifier si elle est consciente.",
            "isCorrect": false,
            "comment": "Toucher la victime sans avoir sécurisé la zone peut être dangereux en cas de danger électrique."
        },
        {
            "text": "Prendre des photos de la scène.",
            "isCorrect": false,
            "comment": "Prendre des photos de la scène peut être utile à des fins d'enquête ou de documentation, mais cela ne doit pas être la priorité lorsqu'une victime est en contact avec un conducteur endommagé."
        }
    ]
},

{
  "text": "Quelles sont les conséquences des accidents barotraumatiques ?",
  "answers": [
      {
          "text": "Des douleurs au niveau des articulations.",
          "isCorrect": false,
          "comment": "Les douleurs au niveau des articulations ne sont pas une conséquence typique des accidents barotraumatiques."
      },
      {
          "text": "Des troubles neurologiques.",
          "isCorrect": false,
          "comment": "Les troubles neurologiques peuvent être causés par certains types d'accidents de plongée, mais ils ne sont pas spécifiquement associés aux accidents barotraumatiques."
      },
      {
          "text": "Des bulles de gaz dans les vaisseaux pulmonaires.",
          "isCorrect": false,
          "comment": "Les bulles de gaz dans les vaisseaux pulmonaires peuvent être une conséquence des accidents de décompression, mais pas spécifiquement des accidents barotraumatiques."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les conséquences des accidents barotraumatiques peuvent inclure des douleurs articulaires, des troubles neurologiques et des bulles de gaz dans les vaisseaux pulmonaires."
      }
  ]
},


{
  "text": "Quelles sont les conséquences des accidents de désaturation ?",
  "answers": [
      {
          "text": "Des douleurs musculaires.",
          "isCorrect": false,
          "comment": "Les douleurs musculaires ne sont pas une conséquence typique des accidents de désaturation."
      },
      {
          "text": "Des troubles de la conscience.",
          "isCorrect": false,
          "comment": "Les troubles de la conscience peuvent être associés à certains types d'accidents de plongée, mais pas spécifiquement aux accidents de désaturation."
      },
      {
          "text": "Des perturbations de l'état de conscience.",
          "isCorrect": false,
          "comment": "C'est une réponse similaire à la précédente."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les conséquences des accidents de désaturation peuvent inclure des troubles de la conscience et des perturbations de l'état de conscience."
      }
  ]
},

{
  "text": "Quelles sont les conséquences principales des concentrations toxiques des gaz ?",
  "answers": [
      {
          "text": "Des troubles cardiaques.",
          "isCorrect": false,
          "comment": "Les troubles cardiaques ne sont pas une conséquence principale des concentrations toxiques des gaz."
      },
      {
          "text": "Des perturbations de l'état de conscience.",
          "isCorrect": false,
          "comment": "Les perturbations de l'état de conscience peuvent être causées par certains types d'accidents de plongée, mais pas spécifiquement par les concentrations toxiques des gaz."
      },
      {
          "text": "Des troubles visuels.",
          "isCorrect": false,
          "comment": "Les troubles visuels peuvent être associés à certains types d'accidents de plongée, mais pas spécifiquement aux concentrations toxiques des gaz."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les conséquences des concentrations toxiques des gaz peuvent inclure des perturbations de l'état de conscience et des troubles visuels."
      }
  ]
},

{
  "text": "Quelles sont les conséquences principales des concentrations toxiques des gaz ?",
  "answers": [
      {
          "text": "Des troubles cardiaques.",
          "isCorrect": false,
          "comment": "Bien que les concentrations toxiques des gaz puissent avoir un impact sur le système cardiovasculaire, ce ne sont pas les conséquences principales."
      },
      {
          "text": "Des perturbations de l'état de conscience.",
          "isCorrect": true,
          "comment": "Les concentrations toxiques des gaz peuvent entraîner des altérations de l'état de conscience, allant de la confusion à la perte de conscience."
      },
      {
          "text": "Des troubles visuels.",
          "isCorrect": false,
          "comment": "Les troubles visuels peuvent survenir avec certaines concentrations toxiques des gaz, mais ce ne sont pas les conséquences principales."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seules les perturbations de l'état de conscience sont les conséquences principales des concentrations toxiques des gaz."
      }
  ]
},
{
  "text": "Quelle est la définition d'une intoxication ?",
  "answers": [
      {
          "text": "Une inflammation des voies respiratoires",
          "isCorrect": false,
          "comment": "Une intoxication n'est pas une inflammation des voies respiratoires, mais un trouble causé par la pénétration d'une substance toxique dans l'organisme."
      },
      {
          "text": "Un trouble causé par la pénétration d'une substance toxique dans l'organisme",
          "isCorrect": true,
          "comment": "Une intoxication est un trouble causé par la pénétration d'une substance toxique dans l'organisme, pouvant entraîner divers symptômes et complications."
      },
      {
          "text": "Une affection cutanée due à une exposition prolongée au soleil",
          "isCorrect": false,
          "comment": "Une intoxication n'est pas une affection cutanée, mais un trouble causé par l'ingestion, l'inhalation, ou le contact avec une substance toxique."
      },
      {
          "text": "Une réaction allergique aux aliments",
          "isCorrect": false,
          "comment": "Une intoxication n'est pas une réaction allergique, mais un trouble causé par la pénétration d'une substance toxique dans l'organisme."
      }
  ]
},
{
  "text": "Quelles sont les différentes voies par lesquelles un poison peut pénétrer dans l'organisme ?",
  "answers": [
      {
          "text": "Digestion, inhalation, absorption, émission",
          "isCorrect": false,
          "comment": "La voie d'émission n'est pas une voie par laquelle un poison peut pénétrer dans l'organisme. Les voies courantes sont l'ingestion, l'inhalation, l'absorption et l'injection."
      },
      {
          "text": "Digestion, inhalation, piqûre, immersion",
          "isCorrect": false,
          "comment": "L'immersion n'est pas une voie courante par laquelle un poison peut pénétrer dans l'organisme. Les voies courantes sont l'ingestion, l'inhalation, l'absorption et l'injection."
      },
      {
          "text": "Ingestion, injection, respiration, absorption",
          "isCorrect": true,
          "comment": "Les principales voies par lesquelles un poison peut pénétrer dans l'organisme sont l'ingestion (digestion), l'injection, la respiration (inhalation) et l'absorption à travers la peau ou les muqueuses."
      },
      {
          "text": "Ingestion, inspiration, injection, érosion",
          "isCorrect": false,
          "comment": "L'inspiration ne se réfère pas à l'inhalation de substances toxiques. Les voies courantes sont l'ingestion, l'inhalation, l'absorption et l'injection."
      }
  ]
},
{
  "text": "Qu'est-ce qui peut également causer des intoxications?",
  "answers": [
      {
          "text": "Les accidents de la route",
          "isCorrect": false,
          "comment": "Bien que les accidents de la route puissent causer des blessures graves, ils ne sont pas la cause directe des intoxications, qui sont dues à l'ingestion, l'inhalation ou l'absorption de substances toxiques."
      },
      {
          "text": "Les infections bactériennes",
          "isCorrect": false,
          "comment": "Les infections bactériennes sont causées par des agents pathogènes, pas par des substances toxiques. Les intoxications sont généralement dues à l'exposition à des substances toxiques."
      },
      {
          "text": "Les drogues, les médicaments et l'alcool",
          "isCorrect": true,
          "comment": "Les intoxications peuvent également être causées par la consommation excessive ou inappropriée de drogues, de médicaments ou d'alcool, ce qui peut entraîner des effets toxiques sur l'organisme."
      },
      {
          "text": "Les blessures sportives",
          "isCorrect": false,
          "comment": "Les blessures sportives sont des traumatismes physiques causés par des activités sportives. Elles ne sont pas considérées comme des intoxications, qui sont dues à l'exposition à des substances toxiques."
      }
  ]
},
{
  "text": "Quels sont les signes caractéristiques de surdosage ou d'intoxication aux opiacés ou aux opioïdes ?",
  "answers": [
      {
          "text": "Pâleur de la peau et sueurs froides",
          "isCorrect": false,
          "comment": "Bien que ces symptômes puissent être présents dans certains cas d'intoxication, les signes caractéristiques d'un surdosage aux opiacés ou aux opioïdes incluent le myosis (réduction de la taille de la pupille) et la dépression respiratoire."
      },
      {
          "text": "Myosis et dépression respiratoire",
          "isCorrect": true,
          "comment": "Les signes caractéristiques d'un surdosage ou d'une intoxication aux opiacés ou aux opioïdes incluent le myosis (réduction de la taille de la pupille) et la dépression respiratoire, qui peuvent être des indicateurs d'une intoxication grave."
      },
      {
          "text": "Augmentation de la fréquence cardiaque et agitation",
          "isCorrect": false,
          "comment": "Une augmentation de la fréquence cardiaque et de l'agitation ne sont généralement pas associées à un surdosage aux opiacés ou aux opioïdes. Ces symptômes peuvent plutôt être observés dans d'autres types d'intoxications ou de troubles."
      },
      {
          "text": "Fièvre et tachycardie",
          "isCorrect": false,
          "comment": "La fièvre et la tachycardie ne sont pas des signes caractéristiques d'un surdosage aux opiacés ou aux opioïdes. Les signes typiques incluent le myosis et la dépression respiratoire."
      }
  ]
},
{
  "text": "Quelle est la recommandation en cas d'intoxication aux opiacés avec dépression respiratoire ?",
  "answers": [
      {
          "text": "Administrer de l'oxygène en inhalation",
          "isCorrect": false,
          "comment": "Bien que l'administration d'oxygène puisse être nécessaire dans certains cas d'intoxication, la recommandation principale en cas d'intoxication aux opiacés avec dépression respiratoire est d'administrer de la naloxone, un antagoniste des opioïdes."
      },
      {
          "text": "Administrer de la morphine",
          "isCorrect": false,
          "comment": "L'administration de morphine n'est pas appropriée en cas d'intoxication aux opiacés, car cela aggraverait la dépression respiratoire. La recommandation principale est d'administrer de la naloxone, un antagoniste des opioïdes."
      },
      {
          "text": "Administrer de l'alprazolam",
          "isCorrect": false,
          "comment": "L'alprazolam est un médicament utilisé pour traiter les troubles anxieux et ne convient pas pour traiter une intoxication aux opiacés. La recommandation principale est d'administrer de la naloxone, un antagoniste des opioïdes."
      },
      {
          "text": "Administrer de la naloxone par pulvérisation intranasale",
          "isCorrect": true,
          "comment": "En cas d'intoxication aux opiacés avec dépression respiratoire, la recommandation principale est d'administrer de la naloxone, un antagoniste des opioïdes, par pulvérisation intranasale pour inverser les effets des opiacés et restaurer la respiration."
      }
  ]
},
{
  "text": "Que faut-il faire en cas de projection d'un toxique sur la peau provoquant une brûlure ?",
  "answers": [
      {
          "text": "Laver abondamment avec de l'eau froide",
          "isCorrect": false,
          "comment": "Bien que le lavage abondant à l'eau soit une mesure initiale importante, en cas de projection d'un toxique provoquant une brûlure, la conduite à tenir est d'adopter la conduite à tenir face à une brûlure chimique, ce qui peut impliquer d'autres mesures spécifiques."
      },
      {
          "text": "Ne rien faire et attendre l'intervention des secours",
          "isCorrect": false,
          "comment": "Il est important d'agir rapidement en cas de projection d'un toxique provoquant une brûlure. Attendre l'intervention des secours sans prendre de mesures immédiates peut aggraver la situation."
      },
      {
          "text": "Appliquer une crème hydratante",
          "isCorrect": false,
          "comment": "L'application d'une crème hydratante n'est pas la mesure appropriée en cas de projection d'un toxique provoquant une brûlure. La conduite à tenir dépend du type de substance impliquée et peut nécessiter des mesures spécifiques."
      },
      {
          "text": "Adopter la conduite à tenir face à une brûlure chimique",
          "isCorrect": true,
          "comment": "En cas de projection d'un toxique provoquant une brûlure, il est essentiel d'adopter la conduite à tenir face à une brûlure chimique, ce qui peut inclure le lavage abondant à l'eau, l'élimination des vêtements contaminés et l'application de mesures spécifiques en fonction du toxique."
      }
  ]
},
{
  "text": "Quelles actions doivent être entreprises en cas d'intoxication en environnement toxique ?",
  "answers": [
      {
          "text": "Se placer au contact direct du toxique pour évaluer la gravité de la situation",
          "isCorrect": false,
          "comment": "Se placer au contact direct du toxique peut mettre en danger la santé de la personne qui intervient. La priorité est de se retirer rapidement de l'environnement toxique et de protéger la victime."
      },
      {
          "text": "Se retirer rapidement de l'environnement toxique et protéger la victime",
          "isCorrect": true,
          "comment": "En cas d'intoxication en environnement toxique, la première action à entreprendre est de se retirer rapidement de l'environnement toxique pour éviter toute exposition supplémentaire, puis de protéger la victime en lui fournissant une assistance médicale si nécessaire."
      },
      {
          "text": "Inhaler volontairement le toxique pour développer une immunité",
          "isCorrect": false,
          "comment": "Inhaler volontairement le toxique est extrêmement dangereux et peut entraîner des dommages graves pour la santé. La priorité est de se retirer de l'environnement toxique et de chercher une assistance médicale."
      },
      {
          "text": "Ignorer l'environnement toxique et se concentrer uniquement sur la victime",
          "isCorrect": false,
          "comment": "Ignorer l'environnement toxique peut mettre en danger la sécurité de la personne qui intervient. Il est essentiel de se retirer de l'environnement toxique tout en protégeant la victime."
      }
  ]
},
{
  "text": "Quels signes peuvent être recherchés lors de l'examen d'une victime d'intoxication pour déterminer la nature du toxique ?",
  "answers": [
      {
          "text": "Présence de pansements sur la peau",
          "isCorrect": false,
          "comment": "La présence de pansements sur la peau ne fournit pas d'indications sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Présence de cicatrices",
          "isCorrect": false,
          "comment": "Bien que la présence de cicatrices puisse indiquer des blessures antérieures, cela ne fournit pas d'informations spécifiques sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Présence de boîtes de médicaments vides",
          "isCorrect": true,
          "comment": "L'examen de la victime d'intoxication peut inclure la recherche de boîtes de médicaments vides ou d'autres emballages de substances toxiques, ce qui peut aider à identifier la nature du toxique et à déterminer le traitement approprié."
      },
      {
          "text": "Présence de vêtements de protection",
          "isCorrect": false,
          "comment": "La présence de vêtements de protection ne fournit pas d'indications directes sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      }
  ]
},
{
  "text": "Quelle est la priorité lors de l'action de secours en cas d'intoxication ?",
  "answers": [
      {
          "text": "Identifier les témoins de l'incident",
          "isCorrect": false,
          "comment": "Bien qu'il soit important de recueillir des informations sur les circonstances de l'intoxication, la priorité lors de l'action de secours est de lutter contre toute détresse vitale de la victime et de fournir une assistance médicale immédiate si nécessaire."
      },
      {
          "text": "Demander un avis médical",
          "isCorrect": false,
          "comment": "Demander un avis médical est une étape importante, mais la priorité lors de l'action de secours en cas d'intoxication est de lutter contre toute détresse vitale de la victime et de fournir une assistance médicale immédiate si nécessaire."
      },
      {
          "text": "Lutter contre une détresse vitale",
          "isCorrect": true,
          "comment": "La priorité lors de l'action de secours en cas d'intoxication est de lutter contre toute détresse vitale de la victime, telle que l'arrêt respiratoire ou cardiaque, et de fournir une assistance médicale immédiate si nécessaire."
      },
      {
          "text": "Examiner les emballages des produits en cause",
          "isCorrect": false,
          "comment": "Bien qu'il soit important de recueillir des informations sur les substances ingérées ou exposées, la priorité lors de l'action de secours est de lutter contre toute détresse vitale de la victime et de fournir une assistance médicale immédiate si nécessaire."
      }
  ]
},
{
  "text": "Quel est le premier regard essentiel lorsqu'on suspecte une intoxication due à un environnement toxique ?",
  "answers": [
      {
          "text": "Observer le ciel pour détecter des signes de pluie acide",
          "isCorrect": false,
          "comment": "Observer le ciel pour détecter des signes de pluie acide est important dans certaines situations environnementales, mais cela ne constitue pas le premier regard essentiel lorsqu'on suspecte une intoxication. Le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable."
      },
      {
          "text": "Examiner attentivement les plantes environnantes",
          "isCorrect": false,
          "comment": "Bien que l'examen des plantes environnantes puisse être pertinent dans certains cas d'intoxication, ce n'est pas le premier regard essentiel lorsqu'on suspecte une intoxication due à un environnement toxique. Le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable."
      },
      {
          "text": "Vérifier la présence de flacons suspects",
          "isCorrect": false,
          "comment": "Bien que la vérification de la présence de flacons suspects puisse être pertinente dans certains contextes, ce n'est pas le premier regard essentiel lorsqu'on suspecte une intoxication due à un environnement toxique. Le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable."
      },
      {
          "text": "Identifier la présence d'un nuage toxique ou d'une odeur désagréable",
          "isCorrect": true,
          "comment": "Lorsqu'on suspecte une intoxication due à un environnement toxique, le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable, ce qui peut indiquer la présence de substances toxiques dans l'air."
      }
  ]
},
{
  "text": "Quels éléments doivent être pris en compte lors de l'examen d'une victime d'intoxication pour déterminer la nature du toxique ?",
  "answers": [
      {
          "text": "Les tatouages sur le corps de la victime",
          "isCorrect": false,
          "comment": "Les tatouages sur le corps de la victime ne fournissent pas d'indications directes sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Les bijoux portés par la victime",
          "isCorrect": false,
          "comment": "Bien que les bijoux portés par la victime puissent être pertinents pour l'identification de la victime, ils ne fournissent pas d'indications sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Les circonstances de survenue, la nature du toxique, la dose supposée absorbée et l'heure de l'ingestion",
          "isCorrect": true,
          "comment": "Lors de l'examen d'une victime d'intoxication, il est important de prendre en compte les circonstances de survenue, la nature du toxique, la dose supposée absorbée et l'heure de l'ingestion, car ces informations peuvent aider à déterminer le traitement approprié et à prévenir les complications."
      },
      {
          "text": "Les vêtements portés par la victime au moment de l'incident",
          "isCorrect": false,
          "comment": "Bien que les vêtements portés par la victime puissent fournir des indices sur la nature du toxique, ils ne sont pas aussi significatifs que d'autres éléments tels que les circonstances de survenue, la dose supposée absorbée et l'heure de l'ingestion."
      }
  ]
},
{
  "text": "Quelles activités peuvent entraîner un syndrome de suspension ?",
  "answers": [
      {
          "text": "L'alpinisme",
          "isCorrect": true,
          "comment": "L'alpinisme est une activité susceptible d'entraîner un syndrome de suspension en cas d'accident ou de chute."
      },
      {
          "text": "Le canyoning",
          "isCorrect": true,
          "comment": "Le canyoning, impliquant des descentes en rappel ou des passages aquatiques, expose les pratiquants au risque de suspension."
      },
      {
          "text": "La natation",
          "isCorrect": false,
          "comment": "La natation ne présente pas de risque de suspension, sauf dans des cas très spécifiques et inhabituels."
      },
      {
          "text": "La randonnée pédestre",
          "isCorrect": false,
          "comment": "En général, la randonnée pédestre ne comporte pas de risque de suspension, sauf en cas d'accidents graves."
      }
  ]
},
{
  "text": "Quels sont les risques associés à la suspension prolongée ?",
  "answers": [
      {
          "text": "Accumulation de sang dans les membres inférieurs",
          "isCorrect": true,
          "comment": "La suspension prolongée peut entraîner une accumulation de sang dans les membres inférieurs, provoquant des complications circulatoires."
      },
      {
          "text": "Ralentissement des battements du cœur",
          "isCorrect": true,
          "comment": "La suspension prolongée peut également entraîner un ralentissement des battements du cœur, compromettant la circulation sanguine."
      },
      {
          "text": "Augmentation de la pression artérielle",
          "isCorrect": false,
          "comment": "La suspension prolongée peut conduire à une baisse de la pression artérielle en raison de l'accumulation de sang dans les membres inférieurs."
      },
      {
          "text": "Hyperactivité musculaire",
          "isCorrect": false,
          "comment": "En cas de suspension prolongée, les muscles peuvent devenir fatigués et développer une hypotonie musculaire plutôt qu'une hyperactivité."
      }
  ]
},
{
  "text": "Quels sont les signes précoces du syndrome de suspension ?",
  "answers": [
      {
          "text": "Fatigue musculaire",
          "isCorrect": false,
          "comment": "La fatigue musculaire peut survenir plus tardivement dans le syndrome de suspension, mais elle n'est pas un signe précoce."
      },
      {
          "text": "Étourdissement, fatigue intense, nausées",
          "isCorrect": true,
          "comment": "Ces symptômes sont des signes précoces courants du syndrome de suspension et indiquent une détresse physiologique."
      },
      {
          "text": "Augmentation de l'appétit",
          "isCorrect": false,
          "comment": "Une augmentation de l'appétit n'est pas un signe précoce typique du syndrome de suspension."
      },
      {
          "text": "Vision floue",
          "isCorrect": false,
          "comment": "La vision floue peut être associée à diverses conditions, mais elle n'est pas spécifique au syndrome de suspension."
      }
  ]
},
{
  "text": "Que peut faire un secouriste en attendant le dégagement de la victime ?",
  "answers": [
      {
          "text": "Maintenir les membres inférieurs en position horizontale",
          "isCorrect": true,
          "comment": "Maintenir les membres inférieurs horizontaux peut aider à prévenir une accumulation excessive de sang dans les jambes."
      },
      {
          "text": "Examiner la victime à la recherche de lésions traumatiques",
          "isCorrect": false,
          "comment": "Bien que l'examen des blessures soit important, la priorité est de stabiliser la victime en attendant le dégagement."
      },
      {
          "text": "Évaluer le niveau de glucose dans le sang",
          "isCorrect": false,
          "comment": "L'évaluation du glucose sanguin n'est pas directement pertinente dans ce contexte d'urgence."
      },
      {
          "text": "Observer le paysage environnant",
          "isCorrect": false,
          "comment": "L'observation du paysage environnant n'est pas une action pertinente en cas de syndrome de suspension."
      }
  ]
},
{
  "text": "Quels sont les objectifs de l'action de secours en cas de syndrome de suspension ?",
  "answers": [
      {
          "text": "Retirer immédiatement le harnais de la victime",
          "isCorrect": false,
          "comment": "Le retrait du harnais peut nécessiter des compétences spécifiques et ne doit pas toujours être immédiat."
      },
      {
          "text": "Surveiller attentivement la victime pour détecter toute aggravation",
          "isCorrect": true,
          "comment": "La surveillance continue est essentielle pour identifier rapidement les signes d'aggravation et intervenir en conséquence."
      },
      {
          "text": "Administer un médicament sans consultation médicale",
          "isCorrect": false,
          "comment": "L'administration de médicaments sans évaluation médicale peut être dangereuse et n'est pas recommandée sans indication précise."
      },
      {
          "text": "Documenter l'incident pour une enquête ultérieure",
          "isCorrect": true,
          "comment": "La documentation précise de l'incident est importante à des fins d'analyse et d'amélioration des pratiques de secours."
      }
  ]
},
{
  "text": "Comment peut se manifester un syndrome de suspension?",
  "answers": [
      {
          "text": "Accumulation du sang dans les parties supérieures du corps",
          "isCorrect": false,
          "comment": "Dans le syndrome de suspension, l'accumulation de sang se produit généralement dans les membres inférieurs, pas dans les parties supérieures du corps."
      },
      {
          "text": "Hypotension",
          "isCorrect": true,
          "comment": "L'hypotension, ou une pression artérielle basse, est courante dans les cas de syndrome de suspension prolongé."
      },
      {
          "text": "Ralentissement des battements du cœur",
          "isCorrect": false,
          "comment": "Le ralentissement cardiaque peut être un symptôme du syndrome de suspension, mais d'autres signes sont plus caractéristiques."
      },
      {
          "text": "Troubles du comportement",
          "isCorrect": true,
          "comment": "Les troubles du comportement, tels que la confusion ou l'irritabilité, peuvent survenir en raison de la détresse physiologique associée à la suspension."
      }
  ]
},
{
  "text": "Quels sont les facteurs favorisants la survenue d'un syndrome de suspension ?",
  "answers": [
      {
          "text": "La consommation de drogues ou d'alcool",
          "isCorrect": true,
          "comment": "La consommation de drogues ou d'alcool peut diminuer les inhibitions et augmenter le risque de comportements à risque, y compris les accidents pouvant entraîner un syndrome de suspension."
      },
      {
          "text": "Une alimentation équilibrée",
          "isCorrect": false,
          "comment": "Bien qu'une alimentation équilibrée soit importante pour la santé en général, elle n'est pas directement liée à la survenue du syndrome de suspension."
      },
      {
          "text": "Un niveau élevé d'activité physique",
          "isCorrect": false,
          "comment": "Bien que l'activité physique puisse augmenter le risque d'accidents, un niveau élevé d'activité physique n'est pas un facteur favorisant spécifique du syndrome de suspension."
      },
      {
          "text": "Un bon sommeil",
          "isCorrect": false,
          "comment": "Bien que le sommeil soit important pour la santé, un bon sommeil n'est pas directement lié à la survenue du syndrome de suspension."
      }
  ]
},
{
  "text": "Que peut-on rechercher lors du bilan de la victime de syndrome de suspension ?",
  "answers": [
      {
          "text": "La couleur des yeux",
          "isCorrect": false,
          "comment": "La couleur des yeux n'est pas pertinente pour le bilan d'un syndrome de suspension, sauf si elle est altérée en raison de l'hypoxie."
      },
      {
          "text": "La durée de la suspension",
          "isCorrect": true,
          "comment": "La durée pendant laquelle la victime a été suspendue est importante pour évaluer les risques potentiels pour sa santé."
      },
      {
          "text": "La marque du harnais ou baudrier",
          "isCorrect": true,
          "comment": "Examiner la marque du harnais ou du baudrier peut fournir des informations sur l'équipement utilisé et les circonstances de l'accident."
      },
      {
          "text": "La température extérieure",
          "isCorrect": false,
          "comment": "La température extérieure peut être un facteur contributif à l'hypothermie ou à l'hyperthermie, mais elle n'est pas une priorité immédiate dans le bilan du syndrome de suspension."
      }
  ]
},
{
  "text": "Quels sont les signes pouvant précéder la perte de conscience dans un syndrome de suspension ?",
  "answers": [
      {
          "text": "Perte de l'appétit",
          "isCorrect": false,
          "comment": "La perte de l'appétit n'est pas un signe spécifique du syndrome de suspension et peut être présente dans de nombreuses autres conditions médicales."
      },
      {
          "text": "Angoisse",
          "isCorrect": true,
          "comment": "L'angoisse ou l'anxiété peut être un signe précurseur de détresse physiologique et de perte de conscience imminente."
      },
      {
          "text": "Augmentation de la pression artérielle",
          "isCorrect": false,
          "comment": "L'augmentation de la pression artérielle n'est généralement pas un signe précurseur de perte de conscience dans un syndrome de suspension."
      },
      {
          "text": "Douleur musculaire",
          "isCorrect": true,
          "comment": "La douleur musculaire peut être un signe précoce de détresse physiologique due à la suspension prolongée."
      }
  ]
},
{
  "text": "Que doit faire un secouriste si la victime est dépendue mais consciente ?",
  "answers": [
      {
          "text": "Desserrer le harnais",
          "isCorrect": true,
          "comment": "Desserrer le harnais peut soulager la pression sur les parties du corps de la victime et améliorer le confort pendant l'attente du dégagement."
      },
      {
          "text": "Retirer immédiatement le harnais",
          "isCorrect": false,
          "comment": "Le retrait immédiat du harnais peut aggraver les blessures ou les complications. Il est préférable de le desserrer d'abord et d'évaluer la situation."
      },
      {
          "text": "Appliquer immédiatement la réanimation cardio-pulmonaire",
          "isCorrect": false,
          "comment": "L'application de la réanimation cardio-pulmonaire n'est pas indiquée si la victime est consciente et respire normalement."
      },
      {
          "text": "Demander à la victime de se lever rapidement",
          "isCorrect": false,
          "comment": "Demander à la victime de se lever rapidement peut augmenter le risque de complications en cas de suspension prolongée."
      }
  ]
},
{
  "text": "Quelle est la première mesure à prendre si la victime a perdu connaissance ?",
  "answers": [
      {
          "text": "Demander à la victime de se réveiller",
          "isCorrect": false,
          "comment": "Demander à la victime de se réveiller est inapproprié si elle est inconsciente, car cela peut aggraver son état."
      },
      {
          "text": "Appliquer immédiatement la réanimation cardio-pulmonaire",
          "isCorrect": false,
          "comment": "Bien que la RCP puisse être nécessaire dans certains cas, la première mesure consiste à placer la victime en position stable."
      },
      {
          "text": "Allonger la victime au sol",
          "isCorrect": true,
          "comment": "La position allongée sur le sol aide à assurer une circulation sanguine adéquate et à éviter les complications liées à la suspension prolongée."
      },
      {
          "text": "Demander à la victime de se relever",
          "isCorrect": false,
          "comment": "Demander à la victime de se relever est dangereux si elle est inconsciente, car cela peut entraîner des blessures supplémentaires."
      }
  ]
},
{
  "text": "Quels sont les objectifs de l'action de secours en cas de syndrome de suspension ?",
  "answers": [
      {
          "text": "Retirer immédiatement le harnais de la victime",
          "isCorrect": false,
          "comment": "Retirer immédiatement le harnais peut aggraver les blessures de la victime et ne fait pas partie des objectifs de l'action de secours."
      },
      {
          "text": "Surveiller attentivement la victime pour détecter toute aggravation",
          "isCorrect": true,
          "comment": "L'un des objectifs de l'action de secours est de surveiller attentivement la victime pour détecter toute aggravation de son état et agir en conséquence."
      },
      {
          "text": "Administer un médicament sans consultation médicale",
          "isCorrect": false,
          "comment": "Administrer un médicament sans consultation médicale peut être dangereux et ne fait pas partie des objectifs de l'action de secours."
      },
      {
          "text": "Documenter l'incident pour une enquête ultérieure",
          "isCorrect": true,
          "comment": "Un autre objectif de l'action de secours est de documenter l'incident pour une enquête ultérieure afin d'améliorer les pratiques de sécurité."
      }
  ]
},


{
      "text": "Quels sont les risques associés à la suspension prolongée ?",
      "answers": [
          {
              "text": "Accumulation de sang dans les membres inférieurs",
              "isCorrect": true,
              "comment": "L'accumulation de sang dans les membres inférieurs est l'un des risques associés à une suspension prolongée."
          },
          {
              "text": "Ralentissement des battements du cœur",
              "isCorrect": true,
              "comment": "Le ralentissement des battements du cœur peut survenir en cas de suspension prolongée, ce qui peut entraîner des complications cardiaques."
          },
          {
              "text": "Augmentation de la pression artérielle",
              "isCorrect": false,
              "comment": "L'augmentation de la pression artérielle n'est pas typiquement associée à une suspension prolongée, mais plutôt à d'autres conditions médicales."
          },
          {
              "text": "Hyperactivité musculaire",
              "isCorrect": false,
              "comment": "L'hyperactivité musculaire n'est pas un risque courant associé à la suspension prolongée, mais plutôt à d'autres situations physiologiques."
          }
      ]
  },

{
  "text": "Quelle est la définition d'une explosion ?",
  "answers": [
      {
          "text": "Libération progressive de gaz sous pression",
          "isCorrect": false,
          "comment": "Une explosion se caractérise par une libération brutale et soudaine de gaz sous pression, pas une libération progressive."
      },
      {
          "text": "Libération brutale et soudaine de gaz sous pression",
          "isCorrect": true,
          "comment": "Une explosion se produit lorsque les gaz sous pression sont libérés de manière brutale et soudaine."
      },
      {
          "text": "Accumulation de gaz dans un espace clos",
          "isCorrect": false,
          "comment": "Cette réponse décrit plutôt la condition nécessaire à une explosion mais ne définit pas explicitement le terme 'explosion'."
      },
      {
          "text": "Pression atmosphérique élevée",
          "isCorrect": false,
          "comment": "La pression atmosphérique élevée peut être liée à une explosion, mais cela ne définit pas directement ce qu'est une explosion."
      }
  ]
},



  {
      "text": "Quels sont les mécanismes lésionnels impliqués dans les blessures liées à une explosion ?",
      "answers": [
          {
              "text": "Le blast primaire",
              "isCorrect": true,
              "comment": "Le blast primaire est l'une des principales formes de lésions causées par une explosion, impliquant la transmission d'ondes de choc à travers les tissus."
          },
          {
              "text": "Le blast secondaire",
              "isCorrect": true,
              "comment": "Le blast secondaire fait référence aux lésions causées par des fragments projetés lors de l'explosion, constituant une forme courante de blessure."
          },
          {
              "text": "Le blast tertiaire",
              "isCorrect": true,
              "comment": "Le blast tertiaire se produit lorsque la victime est projetée et impactée par un objet ou frappe une surface, entraînant des lésions par impact."
          },
          {
              "text": "Le blast quaternaire",
              "isCorrect": true,
              "comment": "Le blast quaternaire fait référence aux lésions résultant de facteurs environnementaux tels que la chaleur, la fumée, ou les gaz toxiques générés par l'explosion."
          }
      ]
  },
  {
      "text": "Quels sont les conséquences possibles du blast primaire ?",
      "answers": [
          {
              "text": "Contusion ou rupture des tympans",
              "isCorrect": true,
              "comment": "Le blast primaire peut causer des lésions aux tympans en raison de la transmission directe des ondes de choc à travers l'air."
          },
          {
              "text": "Lésions du cerveau",
              "isCorrect": false,
              "comment": "Les lésions du cerveau sont généralement associées à d'autres mécanismes, comme le blast secondaire ou tertiaire."
          },
          {
              "text": "Fractures des membres inférieurs",
              "isCorrect": false,
              "comment": "Les fractures des membres inférieurs sont plus souvent associées au blast secondaire ou tertiaire, pas au blast primaire."
          },
          {
              "text": "Brûlures cutanées",
              "isCorrect": false,
              "comment": "Les brûlures cutanées sont généralement causées par le blast quaternaire, pas par le blast primaire."
          }
      ]
  },
  {
      "text": "Quels organes sont principalement touchés par les lésions de blast primaire en milieu aérien ?",
      "answers": [
          {
              "text": "Foie et rate",
              "isCorrect": false,
              "comment": "Ces organes sont moins susceptibles d'être touchés par le blast primaire en milieu aérien."
          },
          {
              "text": "Cœur et poumons",
              "isCorrect": false,
              "comment": "Bien que ces organes puissent être affectés par des explosions, ils ne sont pas les principaux organes touchés par le blast primaire."
          },
          {
              "text": "Reins et pancréas",
              "isCorrect": false,
              "comment": "Ces organes sont moins directement affectés par le blast primaire en milieu aérien."
          },
          {
              "text": "Tympans et larynx",
              "isCorrect": true,
              "comment": "En milieu aérien, les tympans et le larynx sont particulièrement sensibles aux ondes de choc du blast primaire."
          }
      ]
  },
  {
      "text": "Qu'est-ce que le 1er regard permet de constater lors de l'intervention auprès des victimes d'explosion ?",
      "answers": [
          {
              "text": "La couleur des yeux des victimes",
              "isCorrect": false,
              "comment": "La couleur des yeux des victimes n'est pas pertinente pour évaluer l'intervention auprès des victimes d'explosion."
          },
          {
              "text": "La survenue d'une explosion en milieu clos",
              "isCorrect": true,
              "comment": "Le premier regard vise à déterminer si l'explosion s'est produite en milieu clos ou ouvert, ce qui influence la nature des blessures."
          },
          {
              "text": "Les lésions internes des victimes",
              "isCorrect": false,
              "comment": "Les lésions internes peuvent être évaluées par la suite mais ne sont pas visibles au premier regard lors de l'intervention initiale."
          },
          {
              "text": "La présence d'une détresse vitale chez les victimes",
              "isCorrect": false,
              "comment": "Bien que la détresse vitale soit importante, elle n'est pas la première chose à évaluer lors du premier regard."
          }
      ]
  },
  {
      "text": "Quelles sont les différentes lésions induites par le blast tertiaire ?",
      "answers": [
          {
              "text": "Brûlures cutanées",
              "isCorrect": false,
              "comment": "Les brûlures cutanées sont plus associées au blast quaternaire."
          },
          {
              "text": "Traumatismes sévères par projection de la victime",
              "isCorrect": true,
              "comment": "Le blast tertiaire peut causer des traumatismes sévères lorsque la victime est projetée et impactée par des objets."
          },
          {
              "text": "Lésions des organes pleins",
              "isCorrect": false,
              "comment": "Les lésions des organes pleins sont plus souvent associées au blast primaire ou secondaire."
          },
          {
              "text": "Intoxication aux fumées",
              "isCorrect": false,
              "comment": "L'intoxication aux fumées est une conséquence plus probable du blast quaternaire."
          }
      ]
  },
  {
      "text": "Quel est le principal mécanisme responsable des lésions de blast secondaire ?",
      "answers": [
          {
              "text": "Projection de la victime elle-même",
              "isCorrect": false,
              "comment": "Les lésions de blast secondaire sont principalement causées par la projection de matériaux sur la victime, pas par la projection de la victime elle-même."
          },
          {
              "text": "Projection de matériaux sur la victime",
              "isCorrect": true,
              "comment": "Le blast secondaire implique des lésions causées par des fragments projetés ou des débris volants lors de l'explosion."
          },
          {
              "text": "Propagation de l'onde de choc dans l'air",
              "isCorrect": false,
              "comment": "La propagation de l'onde de choc est caractéristique du blast primaire, pas du blast secondaire."
          },
          {
              "text": "Compression des organes creux",
              "isCorrect": false,
              "comment": "La compression des organes creux est un mécanisme plus associé au blast tertiaire."
          }
      ]
  },
  {
      "text": "Quelles sont les lésions potentiellement causées par le blast quaternaire ?",
      "answers": [
          {
              "text": "Brûlures externes",
              "isCorrect": true,
              "comment": "Le blast quaternaire peut entraîner des brûlures externes dues à l'exposition à la chaleur ou à des produits chimiques."
          },
          {
              "text": "Contusions pulmonaires",
              "isCorrect": false,
              "comment": "Les contusions pulmonaires sont plus associées au blast primaire ou secondaire."
          },
          {
              "text": "Traumatismes crâniens",
              "isCorrect": false,
              "comment": "Les traumatismes crâniens peuvent résulter du blast secondaire ou tertiaire, mais pas nécessairement du blast quaternaire."
          },
          {
              "text": "Fractures des membres",
              "isCorrect": false,
              "comment": "Les fractures des membres sont plus associées au blast secondaire ou tertiaire."
          }
      ]
  },
  {
      "text": "Que peut révéler la surdité ou le saignement du conduit auditif chez une victime d'explosion ?",
      "answers": [
          {
              "text": "Des lésions internes graves",
              "isCorrect": true,
              "comment": "La surdité ou le saignement du conduit auditif peut indiquer des lésions internes graves, en particulier des lésions des tympans."
          },
          {
              "text": "Une intoxication aux fumées",
              "isCorrect": false,
              "comment": "La surdité ou le saignement du conduit auditif est plus directement lié aux lésions dues à l'onde de choc de l'explosion, pas à une intoxication aux fumées."
          },
          {
              "text": "Une détresse respiratoire",
              "isCorrect": false,
              "comment": "La surdité ou le saignement du conduit auditif ne sont pas directement liés à une détresse respiratoire."
          },
          {
              "text": "Une fracture du crâne",
              "isCorrect": false,
              "comment": "Bien que possible, la surdité ou le saignement du conduit auditif ne sont pas des indicateurs spécifiques d'une fracture du crâne."
          }
      ]
  },
  {
      "text": "Quel est le principe de l'action de secours recommandé pour les victimes d'explosion ?",
      "answers": [
          {
              "text": "Regrouper les victimes en un point central",
              "isCorrect": false,
              "comment": "Regrouper les victimes n'est pas nécessairement le premier principe d'action de secours dans tous les cas d'explosion."
          },
          {
              "text": "Surveiller attentivement la victime pour détecter toute détresse vitale",
              "isCorrect": true,
              "comment": "L'un des principes fondamentaux est de surveiller attentivement les victimes pour identifier toute détresse vitale et fournir une assistance appropriée."
          },
          {
              "text": "Intervenir immédiatement pour déplacer les victimes",
              "isCorrect": false,
              "comment": "Intervenir immédiatement peut aggraver les blessures des victimes et ne fait pas toujours partie du principe d'action de secours."
          },
          {
              "text": "Éviter tout contact avec les victimes jusqu'à l'arrivée des secours spécialisés",
              "isCorrect": false,
              "comment": "Bien que la sécurité soit importante, ne pas fournir d'assistance immédiate peut aggraver les blessures des victimes et est contraire au principe de secourisme."
          }
      ]
  },
  {
      "text": "Quelles sont les différentes lésions anatomiques générées à la suite d'une forte explosion ?",
      "answers": [
          {
              "text": "Brûlures et coupures",
              "isCorrect": false,
              "comment": "Bien que ces lésions puissent survenir, il existe d'autres types de lésions plus spécifiquement associées à une explosion."
          },
          {
              "text": "Lésions de blast primaire, secondaire, tertiaire et quaternaire",
              "isCorrect": true,
              "comment": "Les lésions de blast primaire, secondaire, tertiaire et quaternaire sont des types spécifiques de lésions anatomiques associées à une explosion."
          },
          {
              "text": "Fractures et luxations",
              "isCorrect": false,
              "comment": "Bien que les fractures et les luxations puissent survenir, elles ne représentent qu'une partie des lésions anatomiques possibles."
          },
          {
              "text": "Blessures causées par des projectiles",
              "isCorrect": false,
              "comment": "Bien que les blessures par projectiles soient une conséquence courante, il existe d'autres types de lésions induites par une explosion."
          }
      ]
  },
  {
      "text": "Quelles parties du corps sont touchées principalement par les lésions de blast primaire ?",
      "answers": [
          {
              "text": "Les organes pleins (foie, rate, cerveau)",
              "isCorrect": false,
              "comment": "Les lésions de blast primaire sont plus susceptibles d'affecter les organes creux et les tissus aériens, pas les organes pleins."
          },
          {
              "text": "Les organes creux (larynx, poumons, organes abdominaux)",
              "isCorrect": true,
              "comment": "Les organes creux, situés près des cavités aériennes, sont plus vulnérables aux ondes de choc du blast primaire."
          },
          {
              "text": "Les membres supérieurs et inférieurs",
              "isCorrect": false,
              "comment": "Les membres peuvent être affectés par le blast primaire mais ne sont pas les parties du corps principalement touchées."
          },
          {
              "text": "La peau et les tissus superficiels",
              "isCorrect": false,
              "comment": "Bien que la peau puisse être affectée, elle n'est pas la principale cible des lésions de blast primaire."
          }
      ]
  },
  {
      "text": "Que doit faire un secouriste en présence de nombreuses victimes d'explosion ?",
      "answers": [
          {
              "text": "Regrouper les victimes en un point et appliquer la conduite à tenir adaptée",
              "isCorrect": true,
              "comment": "En présence de nombreuses victimes, regrouper les victimes en un point central et appliquer une conduite à tenir adaptée est essentiel pour une intervention efficace."
          },
          {
              "text": "Demander des moyens de secours spécialisés et réaliser chaque regard",
              "isCorrect": false,
              "comment": "Bien que l'assistance spécialisée soit nécessaire, il est également important de coordonner les actions immédiates sur le site."
          },
          {
              "text": "Garantir la sécurité des lieux et surveiller attentivement la victime",
              "isCorrect": false,
              "comment": "Bien que la sécurité soit importante, il est également crucial de fournir une assistance immédiate aux victimes en évaluant et en traitant leurs blessures."
          },
          {
              "text": "Transmettre le bilan systématique pour toute personne exposée à l'effet de souffle",
              "isCorrect": false,
              "comment": "Bien que la communication des informations soit importante, cela ne constitue pas la première priorité en présence de nombreuses victimes nécessitant une intervention immédiate."
          }
      ]
  },
  {
      "text": "Quel signe révélateur peut indiquer une exposition à une explosion chez une personne apparemment indemne ?",
      "answers": [
          {
              "text": "Une douleur abdominale intense",
              "isCorrect": false,
              "comment": "Bien que la douleur abdominale puisse être présente, elle n'est pas un indicateur spécifique d'une exposition à une explosion."
          },
          {
              "text": "Une détresse respiratoire évidente",
              "isCorrect": false,
              "comment": "Bien que la détresse respiratoire soit une conséquence possible, elle n'est pas toujours présente chez les victimes apparemment indemnes."
          },
          {
              "text": "Un saignement abondant",
              "isCorrect": false,
              "comment": "Le saignement peut être causé par diverses blessures et n'est pas spécifique à une exposition à une explosion."
          },
          {
              "text": "Des signes auditifs comme un bourdonnement d'oreille ou un saignement du conduit auditif",
              "isCorrect": true,
              "comment": "Des signes auditifs tels qu'un bourdonnement d'oreille ou un saignement du conduit auditif peuvent indiquer une exposition à une explosion, même si la personne semble indemne."
          }
      ]
  },
  {
      "text": "Quel est l'effet de l'explosion sur la pression atmosphérique environnante ?",
      "answers": [
          {
              "text": "Elle la diminue de manière significative",
              "isCorrect": false,
              "comment": "L'explosion augmente généralement la pression atmosphérique, suivie d'une diminution rapide."
          },
          {
              "text": "Elle la maintient stable",
              "isCorrect": false,
              "comment": "L'explosion perturbe généralement la stabilité de la pression atmosphérique dans la zone affectée."
          },
          {
              "text": "Elle génère une augmentation de la pression suivie d'une dépression",
              "isCorrect": true,
              "comment": "L'explosion crée une onde de choc qui génère initialement une augmentation de la pression atmosphérique, suivie d'une dépression."
          },
          {
              "text": "Elle ne produit aucun effet sur la pression atmosphérique",
              "isCorrect": false,
              "comment": "L'explosion perturbe généralement la pression atmosphérique dans la zone affectée, même si cet effet peut être transitoire."
          }
      ]
  },
  {
    "text": "Quelles actions doivent entreprendre les témoins sur les lieux de l'avalanche ?",
    "answers": [
        {
            "text": "Donner l'alerte, entamer les recherches et dégager les victimes",
            "isCorrect": true,
            "comment": "Les témoins doivent donner l'alerte, entamer les recherches et dégager les victimes pour augmenter les chances de survie."
        },
        {
            "text": "Donner les premiers secours, contacter les autorités et évacuer la zone",
            "isCorrect": false,
            "comment": "Bien que ces actions soient importantes, la priorité est de donner l'alerte, entamer les recherches et dégager les victimes."
        },
        {
            "text": "Prendre des photos, évaluer les dégâts et contacter les assurances",
            "isCorrect": false,
            "comment": "Les actions immédiates doivent viser à sauver des vies, pas à documenter les dégâts."
        },
        {
            "text": "Attendre l'arrivée des secours et ne rien faire",
            "isCorrect": false,
            "comment": "Attendre passivement peut réduire les chances de survie des victimes. Donner l'alerte et entreprendre des actions de secours sont essentiels."
        }
    ]
},
{
    "text": "Quel est le mécanisme principal de décès des victimes d'avalanche ?",
    "answers": [
        {
            "text": "Traumatismes causés par les chocs directs",
            "isCorrect": false,
            "comment": "Bien que les traumatismes directs puissent être fatals, le mécanisme principal de décès est l'asphyxie due à différents mécanismes."
        },
        {
            "text": "Compression du thorax par une neige compacte",
            "isCorrect": false,
            "comment": "Bien que la compression puisse être un facteur, l'asphyxie est le mécanisme principal de décès."
        },
        {
            "text": "Asphyxie due à différents mécanismes",
            "isCorrect": true,
            "comment": "L'asphyxie, souvent due à l'obstruction des voies aériennes, est le mécanisme principal de décès des victimes d'avalanche."
        },
        {
            "text": "Hypothermie prolongée",
            "isCorrect": false,
            "comment": "Bien que l'hypothermie puisse être mortelle, l'asphyxie est généralement le mécanisme principal de décès dans les avalanches."
        }
    ]
},
{
    "text": "Quel est l'un des mécanismes possibles d'asphyxie des victimes d'avalanche ?",
    "answers": [
        {
            "text": "Perte de conscience due à la fatigue",
            "isCorrect": false,
            "comment": "La fatigue peut être un facteur, mais l'asphyxie est généralement due à l'obstruction des voies aériennes par la neige."
        },
        {
            "text": "Compression des membres inférieurs",
            "isCorrect": false,
            "comment": "La compression des membres inférieurs peut survenir mais n'est pas un mécanisme d'asphyxie."
        },
        {
            "text": "Obstruction immédiate des Voies Aériennes Supérieures par la neige",
            "isCorrect": true,
            "comment": "L'obstruction des voies aériennes par la neige peut entraîner une asphyxie rapide chez les victimes ensevelies par une avalanche."
        },
        {
            "text": "Brûlures causées par l'exposition prolongée à la neige",
            "isCorrect": false,
            "comment": "Bien que l'exposition prolongée puisse causer des lésions, l'asphyxie est plus susceptible d'être le mécanisme principal."
        }
    ]
},
{
    "text": "Quel est l'un des facteurs qui influent sur les traumatismes subis par une victime ensevelie ?",
    "answers": [
        {
            "text": "Le type de roche présente dans la zone d'avalanche",
            "isCorrect": false,
            "comment": "La composition du sol peut affecter la rapidité et la nature de l'avalanche, mais les traumatismes sont plus souvent dus à d'autres facteurs."
        },
        {
            "text": "Le type de végétation environnante",
            "isCorrect": false,
            "comment": "Bien que la végétation puisse influencer la stabilité de la neige, elle n'est pas directement liée aux traumatismes subis par les victimes."
        },
        {
            "text": "La présence d'obstacles comme les arbres ou les rochers",
            "isCorrect": true,
            "comment": "Les obstacles tels que les arbres ou les rochers peuvent causer des traumatismes importants aux victimes ensevelies par une avalanche."
        },
        {
            "text": "La vitesse du vent au moment de l'avalanche",
            "isCorrect": false,
            "comment": "La vitesse du vent peut affecter la formation de l'avalanche mais n'est pas directement liée aux traumatismes subis par les victimes ensevelies."
        }
    ]
},
{
    "text": "Quel est l'effet de l'hypothermie sur le corps d'une victime ensevelie ?",
    "answers": [
        {
            "text": "Elle augmente la pression artérielle",
            "isCorrect": false,
            "comment": "L'hypothermie a tendance à abaisser la pression artérielle plutôt qu'à l'augmenter."
        },
        {
            "text": "Elle accélère le rythme cardiaque",
            "isCorrect": false,
            "comment": "L'hypothermie a tendance à ralentir le rythme cardiaque plutôt qu'à l'accélérer."
        },
        {
            "text": "Elle entraîne une bradycardie et des troubles de conscience",
            "isCorrect": true,
            "comment": "L'hypothermie peut entraîner une bradycardie (rythme cardiaque lent) et des troubles de conscience chez une victime ensevelie."
        },
        {
            "text": "Elle diminue la sensation de froid",
            "isCorrect": false,
            "comment": "L'hypothermie peut réduire la sensibilité au froid, mais cela ne compense pas ses effets potentiellement dangereux sur le corps."
        }
    ]
},
{
    "text": "Pourquoi est-il important de repérer la présence d'une poche d'air lors du dégagement de la tête de la victime ensevelie ?",
    "answers": [
        {
            "text": "Pour décider si la victime doit être évacuée rapidement",
            "isCorrect": false,
            "comment": "L'évaluation de la poche d'air est importante pour adapter la conduite à tenir, mais cela ne détermine pas nécessairement la nécessité d'une évacuation rapide."
        },
        {
            "text": "Pour évaluer l'ampleur des lésions traumatiques",
            "isCorrect": false,
            "comment": "Bien que l'évaluation des lésions soit importante, la présence d'une poche d'air est plus pertinente pour fournir une ventilation efficace."
        },
        {
            "text": "Pour déterminer si la victime est encore consciente",
            "isCorrect": false,
            "comment": "La présence d'une poche d'air n'est pas nécessairement liée à la conscience de la victime. Elle est importante pour fournir de l'oxygène si nécessaire."
        },
        {
            "text": "Pour adapter la conduite à tenir et fournir de l'oxygène si nécessaire",
            "isCorrect": true,
            "comment": "Repérer une poche d'air permet d'adapter la prise en charge de la victime et de fournir de l'oxygène pour prévenir l'asphyxie."
        }
    ]
},
{
    "text": "Quel est l'un des mécanismes de traumatismes subis par une victime ensevelie dans une avalanche ?",
    "answers": [
        {
            "text": "L'écrasement par la neige compacte",
            "isCorrect": false,
            "comment": "L'écrasement est un mécanisme de traumatisme, mais les chocs contre des obstacles comme les rochers ou les arbres sont également fréquents."
        },
        {
            "text": "La déshydratation due à l'exposition prolongée",
            "isCorrect": false,
            "comment": "La déshydratation peut être un problème, mais les traumatismes physiques sont plus immédiats et graves dans les premières minutes après l'avalanche."
        },
        {
            "text": "Les brûlures causées par le frottement avec la neige",
            "isCorrect": false,
            "comment": "Les brûlures sont peu probables dans une avalanche. Les traumatismes sont généralement dus à des chocs contre des obstacles ou à l'asphyxie."
        },
        {
            "text": "Les chocs directs contre les rochers ou les arbres",
            "isCorrect": true,
            "comment": "Les chocs contre des obstacles solides comme les rochers ou les arbres sont l'un des principaux mécanismes de traumatismes dans les avalanches."
        }
    ]
},
{
    "text": "Quelles sont les actions prioritaires lors de la prise en charge d'une victime ensevelie par une avalanche ?",
    "answers": [
        {
            "text": "Stabiliser le rachis cervical et libérer les voies aériennes",
            "isCorrect": true,
            "comment": "La priorité est de stabiliser le rachis cervical pour éviter les lésions de la moelle épinière et de libérer les voies aériennes pour assurer une ventilation adéquate."
        },
        {
            "text": "Évaluer le niveau de conscience et administrer des analgésiques",
            "isCorrect": false,
            "comment": "Bien que l'évaluation du niveau de conscience soit importante, elle est secondaire par rapport à la stabilisation du rachis cervical et à la ventilation."
        },
        {
            "text": "Évacuer immédiatement la victime vers un centre hospitalier",
            "isCorrect": false,
            "comment": "L'évacuation immédiate peut aggraver les blessures sans une stabilisation préalable du rachis cervical et de la ventilation."
        },
        {
            "text": "Appliquer un bandage compressif sur les plaies visibles",
            "isCorrect": false,
            "comment": "Les plaies externes peuvent être importantes, mais la priorité initiale est de stabiliser la colonne cervicale et de s'assurer d'une respiration libre."
        }
    ]
},
{
    "text": "Quelle est la première mesure à prendre par les témoins sur les lieux d'une avalanche ?",
    "answers": [
        {
            "text": "Dégager immédiatement les victimes",
            "isCorrect": false,
            "comment": "Bien que le dégagement soit important, la première mesure consiste à donner l'alerte pour déclencher les secours."
        },
        {
            "text": "Donner l'alerte",
            "isCorrect": true,
            "comment": "La première mesure doit être de donner l'alerte pour déclencher les secours et l'aide spécialisée."
        },
        {
            "text": "Prendre des photos des lieux",
            "isCorrect": false,
            "comment": "Bien que la documentation soit importante, la priorité initiale est de signaler l'incident pour obtenir de l'aide."
        },
        {
            "text": "Se protéger des risques d'avalanche",
            "isCorrect": false,
            "comment": "Se protéger est important, mais cela vient après avoir donné l'alerte pour obtenir de l'aide."
        }
    ]
},
{
  "text": "Quel est le principal mécanisme de foudroiement indirect ?",
  "answers": [
      {
          "text": "La foudre tombe directement sur la victime",
          "isCorrect": false,
          "comment": "Le principal mécanisme de foudroiement indirect implique que la foudre passe au travers du corps de la victime à partir d'un point de contact."
      },
      {
          "text": "La foudre passe au travers du corps de la victime à partir d'un point de contact",
          "isCorrect": true,
          "comment": "Le foudroiement indirect survient lorsque la foudre traverse le corps d'une personne à partir d'un point de contact."
      },
      {
          "text": "La foudre se propage d'individu en individu dans un groupe",
          "isCorrect": false,
          "comment": "Ce mécanisme décrit le foudroiement latéral, où la foudre peut se propager d'une personne à une autre dans un groupe."
      },
      {
          "text": "La foudre est attirée par les objets métalliques que porte la victime",
          "isCorrect": false,
          "comment": "Les objets métalliques peuvent potentiellement augmenter le risque de foudroiement direct, mais ils ne sont pas le principal mécanisme du foudroiement indirect."
      }
  ]
},
{
  "text": "Quels sont les risques potentiels associés à un foudroiement ?",
  "answers": [
      {
          "text": "Brûlures, traumatismes et hypothermie",
          "isCorrect": true,
          "comment": "Les risques potentiels d'un foudroiement incluent des brûlures, des traumatismes et une hypothermie due à l'exposition prolongée."
      },
      {
          "text": "Détérioration des appareils électroniques et perte de communication",
          "isCorrect": false,
          "comment": "Bien que les appareils électroniques puissent être endommagés par la foudre, les risques pour les personnes comprennent principalement des blessures physiques."
      },
      {
          "text": "Évanouissement et troubles digestifs",
          "isCorrect": false,
          "comment": "Bien que des problèmes de santé puissent survenir, les risques potentiels incluent principalement des brûlures, des traumatismes et une hypothermie."
      },
      {
          "text": "Problèmes de vision et de coordination",
          "isCorrect": false,
          "comment": "Ces problèmes peuvent survenir en cas de foudroiement, mais les risques principaux sont les brûlures, les traumatismes et l'hypothermie."
      }
  ]
},
{
  "text": "Quel est l'un des signes possibles d'un foudroiement indirect ?",
  "answers": [
      {
          "text": "Présence de filaments bleus ou violets autour de la victime",
          "isCorrect": false,
          "comment": "Cette description correspond plus souvent à un foudroiement direct."
      },
      {
          "text": "Apparition de brûlures internes sur la peau",
          "isCorrect": false,
          "comment": "Les brûlures internes ne sont pas un signe typique de foudroiement indirect."
      },
      {
          "text": "Marques cutanées en forme de fougère",
          "isCorrect": true,
          "comment": "Les marques cutanées en forme de fougère sont souvent observées chez les victimes de foudroiement indirect."
      },
      {
          "text": "Sensation de chaleur intense dans tout le corps",
          "isCorrect": false,
          "comment": "La sensation de chaleur intense est plus fréquente dans un foudroiement direct."
      }
  ]
},
{
  "text": "Quelles sont les actions prioritaires lors de la prise en charge d'une victime foudroyée ?",
  "answers": [
      {
          "text": "Évaluer les signes d'électrisation et administrer des analgésiques",
          "isCorrect": false,
          "comment": "La priorité est de mettre en sécurité la victime et d'appliquer la conduite à tenir en cas d'arrêt cardiaque."
      },
      {
          "text": "Mettre en sécurité la victime et appliquer la conduite à tenir en cas d'arrêt cardiaque",
          "isCorrect": true,
          "comment": "La priorité est de protéger la victime et de fournir une assistance immédiate en cas d'arrêt cardiaque."
      },
      {
          "text": "Immobiliser la victime et réaliser une extraction d'urgence",
          "isCorrect": false,
          "comment": "L'immobilisation peut être nécessaire, mais la sécurité et le traitement de l'arrêt cardiaque sont prioritaires."
      },
      {
          "text": "Administrer immédiatement de l'oxygène en cas de signes d'hypothermie",
          "isCorrect": false,
          "comment": "L'oxygène peut être nécessaire, mais la priorité est de traiter l'arrêt cardiaque et de mettre en sécurité la victime."
      }
  ]
},
{
    "text": "Quelles sont les recommandations de sécurité en cas de risque persistant de foudre ?",
    "answers": [
        {
            "text": "Se tenir en position assise en boule sur un sac ou une corde",
            "isCorrect": false,
            "comment": "Cette position ne réduit pas significativement le risque de foudroiement."
        },
        {
            "text": "Progresser en faisant de grands pas pour minimiser le temps d'exposition",
            "isCorrect": false,
            "comment": "Se déplacer n'offre pas une protection adéquate contre la foudre."
        },
        {
            "text": "S'éloigner des arbres",
            "isCorrect": true,
            "comment": "S'éloigner des arbres réduit le risque de foudroiement en diminuant la probabilité d'un impact direct."
        },
        {
            "text": "Éviter de porter un casque de protection pour ne pas attirer la foudre",
            "isCorrect": false,
            "comment": "Les casques de protection"
        }
    ]
  },
  {
    "text": "Pourquoi est-il important de repérer la présence d'une poche d'air lors du dégagement de la tête de la victime ensevelie ?",
    "answers": [
        {
            "text": "Pour décider si la victime doit être évacuée rapidement",
            "isCorrect": false,
            "comment": "La présence d'une poche d'air n'indique pas automatiquement la nécessité d'une évacuation rapide."
        },
        {
            "text": "Pour évaluer l'ampleur des lésions traumatiques",
            "isCorrect": false,
            "comment": "La présence d'une poche d'air n'est pas directement liée à l'ampleur des lésions traumatiques."
        },
        {
            "text": "Pour déterminer si la victime est encore consciente",
            "isCorrect": false,
            "comment": "La présence d'une poche d'air ne permet pas de déterminer directement si la victime est consciente."
        },
        {
            "text": "Pour adapter la conduite à tenir et fournir de l'oxygène si nécessaire",
            "isCorrect": true,
            "comment": "Repérer une poche d'air permet d'adapter la prise en charge et de fournir de l'oxygène si la victime en a besoin."
        }
    ]
  },
  {
    "text": "Quels sont les types de lésions possibles causées par le blast (onde de choc) d'une foudre ?",
    "answers": [
        {
            "text": "Brûlures thermiques seulement",
            "isCorrect": false,
            "comment": "Le blast de foudre peut causer diverses lésions en plus des brûlures thermiques."
        },
        {
            "text": "Troubles de la vision et troubles de l'audition",
            "isCorrect": false,
            "comment": "Bien que ces troubles puissent survenir, d'autres lésions sont également possibles."
        },
        {
            "text": "Paralysie des membres inférieurs",
            "isCorrect": false,
            "comment": "La paralysie n'est pas un effet courant du blast de foudre."
        },
        {
            "text": "Marques cutanées en forme de fougère et arrêt cardiaque",
            "isCorrect": true,
            "comment": "Les lésions typiques du blast de foudre incluent les marques en forme de fougère sur la peau et les arrêts cardiaques."
        }
    ]
  },
  {
    "text": "Quelles sont les mesures de sécurité recommandées en cas de risque de foudre persistant ?",
    "answers": [
        {
            "text": "S'approcher des arbres pour se protéger",
            "isCorrect": false,
            "comment": "S'approcher des arbres augmente le risque de foudroiement."
        },
        {
            "text": "Se mettre à découvert pour éviter les chocs directs",
            "isCorrect": false,
            "comment": "Se mettre à découvert expose davantage à la foudre."
        },
        {
            "text": "S'éloigner des endroits élevés et des arbres isolés",
            "isCorrect": true,
            "comment": "S'éloigner des endroits élevés et des arbres réduit le risque de foudroiement."
        },
        {
            "text": "Se réfugier sous un abri métallique",
            "isCorrect": false,
            "comment": "Les abris métalliques attirent la foudre et ne sont pas sûrs."
        }
    ]
  },
  {
    "text": "Quel est l'un des effets possibles d'un foudroiement indirect sur une victime ?",
    "answers": [
        {
            "text": "Brûlures internes sévères",
            "isCorrect": false,
            "comment": "Les brûlures internes ne sont pas un effet courant du foudroiement indirect."
        },
        {
            "text": "Perte de cheveux",
            "isCorrect": false,
            "comment": "La perte de cheveux n'est pas un effet typique du foudroiement indirect."
        },
        {
            "text": "Paralysie induite par le courant de foudre",
            "isCorrect": true,
            "comment": "La paralysie peut résulter du passage du courant de foudre à travers le corps."
        },
        {
            "text": "Augmentation de la température corporelle",
            "isCorrect": false,
            "comment": "L'augmentation de la température corporelle n'est pas un effet du foudroiement indirect."
        }
    ]
  },
  {
    "text": "Quelles sont les actions prioritaires lors de la prise en charge d'une victime foudroyée ?",
    "answers": [
        {
            "text": "Appliquer immédiatement de la glace sur les brûlures",
            "isCorrect": false,
            "comment": "Appliquer de la glace n'est pas une priorité dans la prise en charge initiale d'une victime foudroyée."
        },
        {
            "text": "Demander à la victime de se lever rapidement",
            "isCorrect": false,
            "comment": "Demander à la victime de se lever peut aggraver ses blessures et ne fait pas partie de la prise en charge initiale."
        },
        {
            "text": "Mettre en sécurité la victime et appliquer la conduite à tenir en cas d'arrêt cardiaque",
            "isCorrect": true,
            "comment": "La priorité est de protéger la victime, puis d'appliquer les premiers secours, y compris la RCP si nécessaire."
        }
    ]
  },
  {
    "text": "Quelle est la différence entre la pendaison et la strangulation?",
    "answers": [
        {
            "text": "La pendaison concerne la suspension du corps par le cou, tandis que la strangulation implique une pression sur la gorge.",
            "isCorrect": true,
            "comment": "Correct. La pendaison se réfère à la suspension du corps par le cou, tandis que la strangulation implique une pression sur la gorge."
        },
        {
            "text": "La pendaison est toujours accidentelle, tandis que la strangulation peut être volontaire ou accidentelle.",
            "isCorrect": false,
            "comment": "Incorrect. La nature de l'accident peut varier dans les deux cas, et la pendaison peut également être intentionnelle."
        },
        {
            "text": "La pendaison est causée par un vêtement qui se prend dans une machine, tandis que la strangulation est causée par un objet constrictif.",
            "isCorrect": false,
            "comment": "Incorrect. La pendaison et la strangulation peuvent toutes deux être causées par un objet constrictif, mais la pendaison implique la suspension du corps par le cou."
        },
        {
            "text": "La pendaison est une constriction du cou, tandis que la strangulation est une suspension du corps par le cou.",
            "isCorrect": false,
            "comment": "Incorrect. Ces définitions sont inversées. La pendaison implique la suspension du corps par le cou, tandis que la strangulation implique une constriction de la gorge."
        }
    ]
  },
  {
    "text": "Quelles sont les causes possibles de la pendaison et de la strangulation?",
    "answers": [
        {
            "text": "Un accident de la route",
            "isCorrect": false,
            "comment": "Incorrect. Les accidents de la route ne sont pas des causes typiques de pendaison ou de strangulation."
        },
        {
            "text": "Une chute depuis une hauteur",
            "isCorrect": false,
            "comment": "Incorrect. Les chutes depuis une hauteur ne sont pas des causes typiques de pendaison ou de strangulation."
        },
        {
            "text": "Un vêtement qui se prend dans une machine",
            "isCorrect": true,
            "comment": "Correct. Un vêtement qui se prend dans une machine peut entraîner une pendaison ou une strangulation."
        },
        {
            "text": "Une blessure sportive",
            "isCorrect": false,
            "comment": "Incorrect. Les blessures sportives ne sont pas des causes typiques de pendaison ou de strangulation."
        }
    ]
  },
  {
    "text": "Quels sont les risques et les conséquences de la pendaison et de la strangulation ?",
    "answers": [
        {
            "text": "Lésion des membres inférieurs",
            "isCorrect": false,
            "comment": "Incorrect. Les lésions des membres inférieurs ne sont pas typiques de la pendaison ou de la strangulation."
        },
        {
            "text": "Compression des voies aériennes et interruption de la circulation sanguine vers le cerveau",
            "isCorrect": true,
            "comment": "Correct. La compression des voies aériennes et l'interruption de la circulation sanguine vers le cerveau sont des risques graves associés à la pendaison et à la strangulation."
        },
        {
            "text": "Augmentation du flux sanguin vers le cerveau",
            "isCorrect": false,
            "comment": "Incorrect. L'augmentation du flux sanguin vers le cerveau n'est pas une conséquence typique de la pendaison ou de la strangulation."
        },
        {
            "text": "Diminution de la pression intra-abdominale",
            "isCorrect": false,
            "comment": "Incorrect. La diminution de la pression intra-abdominale n'est pas une conséquence typique de la pendaison ou de la strangulation."
        }
    ]
  },
  {
    "text": "Quel est le premier signe permettant de suspecter une pendaison ou une strangulation ?",
    "answers": [
        {
            "text": "Une perte de connaissance",
            "isCorrect": false,
            "comment": "Incorrect. Une perte de connaissance peut survenir, mais ce n'est pas le premier signe typique de la pendaison ou de la strangulation."
        },
        {
            "text": "La présence d'un objet constrictif autour du cou",
            "isCorrect": true,
            "comment": "Correct. La présence d'un objet constrictif autour du cou est souvent le premier signe de pendaison ou de strangulation."
        },
        {
            "text": "Des douleurs thoraciques",
            "isCorrect": false,
            "comment": "Incorrect. Les douleurs thoraciques peuvent survenir, mais ce n'est pas le premier signe typique de la pendaison ou de la strangulation."
        },
        {
            "text": "Une augmentation de la fréquence cardiaque",
            "isCorrect": false,
            "comment": "Incorrect. Une augmentation de la fréquence cardiaque peut survenir, mais ce n'est pas le premier signe typique de la pendaison ou de la strangulation."
        }
    ]
  },
  {
    "text": "Quels symptômes peut présenter une victime consciente de pendaison ou de strangulation ?",
    "answers": [
        {
            "text": "Fièvre et douleurs abdominales",
            "isCorrect": false,
            "comment": "Incorrect. Ces symptômes ne sont pas typiques de la pendaison ou de la strangulation."
        },
        {
            "text": "Raucité de la voix et difficulté à respirer",
            "isCorrect": true,
            "comment": "Correct. La raucité de la voix et la difficulté à respirer sont des symptômes courants chez une victime consciente de pendaison ou de strangulation."
        },
        {
            "text": "Étourdissements et perte d'équilibre",
            "isCorrect": false,
            "comment": "Incorrect. Ces symptômes ne sont pas typiques de la pendaison ou de la strangulation."
        },
        {
            "text": "Frissons et perte d'appétit",
            "isCorrect": false,
            "comment": "Incorrect. Ces symptômes ne sont pas typiques de la pendaison ou de la strangulation."
        }
    ]
  },
  {
    "text": "Quelle est la première action à entreprendre lors de la prise en charge d'une victime de pendaison ou de strangulation ?",
    "answers": [
        {
            "text": "Appliquer immédiatement des compressions thoraciques",
            "isCorrect": false,
            "comment": "Incorrect. La première action consiste à desserrer et à enlever rapidement toute source de constriction du cou."
        },
        {
            "text": "Allonger la victime au sol en limitant les mouvements du rachis cervical",
            "isCorrect": false,
            "comment": "Incorrect. Bien que la position de la victime soit importante, la première priorité est de retirer la source de constriction du cou."
        },
        {
            "text": "Desserrer et enlever rapidement toute source de constriction du cou",
            "isCorrect": true,
            "comment": "Correct. La première action consiste à desserrer et à enlever rapidement toute source de constriction du cou pour restaurer la respiration."
        },
        {
            "text": "Transmettre le bilan pour obtenir un avis médical",
            "isCorrect": false,
            "comment": "Incorrect. La première priorité est de desserrer et d'enlever toute source de constriction du cou avant de demander un avis médical."
        }
    ]
  },
  {
    "text": "Que doit-on faire en cas de pendaison pour soutenir la victime ?",
    "answers": [
        {
            "text": "La laisser suspendue jusqu'à l'arrivée des secours",
            "isCorrect": false,
            "comment": "Incorrect. Il est important de soutenir la victime en attendant l'arrivée des secours pour éviter toute détérioration supplémentaire de son état."
        },
        {
            "text": "Tenter de couper la corde ou l'objet de suspension",
            "isCorrect": false,
            "comment": "Incorrect. Tenter de couper la corde peut aggraver les blessures de la victime. Il est préférable de soutenir la victime en attendant les secours."
        },
        {
            "text": "Soutenir la victime en se faisant aider",
            "isCorrect": true,
            "comment": "Correct. Il est important de soutenir la victime en se faisant aider pour prévenir toute détérioration supplémentaire de son état jusqu'à l'arrivée des secours."
        },
        {
            "text": "Tenter de réanimer immédiatement la victime",
            "isCorrect": false,
            "comment": "Incorrect. Il est important de soutenir la victime en attendant les secours. La réanimation peut être nécessaire, mais elle doit être réalisée par des professionnels de la santé."
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
