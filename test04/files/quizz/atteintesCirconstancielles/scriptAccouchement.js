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
      feedbackText = " ";
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
            "comment": " L'accouchement inopiné se produit avant l'arrivée des secours."
        },
        {
            "text": "Un accouchement qui se déroule avant l'arrivée des secours.",
            "isCorrect": true,
            "comment": "L'accouchement inopiné se produit avant l'arrivée des secours."
        },
        {
            "text": "Un accouchement qui se déroule sous césarienne.",
            "isCorrect": false,
            "comment": " L'accouchement inopiné se produit avant l'arrivée des secours."
        },
        {
            "text": "Un accouchement qui se déroule dans une maternité mais sans assistance médicale.",
            "isCorrect": false,
            "comment": " Cette réponse ne définit pas correctement l'accouchement inopiné."
        }
    ]
},
{
    "text": "À quelle semaine de grossesse l'accouchement se produit-il en moyenne ?",
    "answers": [
        {
            "text": "36 semaines.",
            "isCorrect": false,
            "comment": " L'accouchement moyen se produit plus tard dans la grossesse."
        },
        {
            "text": "38 semaines.",
            "isCorrect": false,
            "comment": " L'accouchement moyen se produit plus tard dans la grossesse."
        },
        {
            "text": "39 semaines.",
            "isCorrect": true,
            "comment": "L'accouchement moyen se produit en moyenne autour de la 39e semaine de grossesse."
        },
        {
            "text": "42 semaines.",
            "isCorrect": false,
            "comment": " 42 semaines est considérée comme une grossesse prolongée."
        }
    ]
},
{
    "text": "Quelle est la première étape de l'accouchement ?",
    "answers": [
        {
            "text": "Le travail.",
            "isCorrect": true,
            "comment": "Le travail est la première étape de l'accouchement, marqué par les contractions utérines."
        },
        {
            "text": "L'expulsion.",
            "isCorrect": false,
            "comment": " L'expulsion est la deuxième étape de l'accouchement."
        },
        {
            "text": "La délivrance.",
            "isCorrect": false,
            "comment": " La délivrance est la troisième étape de l'accouchement."
        },
        {
            "text": "La contraction.",
            "isCorrect": false,
            "comment": " La contraction est une partie du processus du travail."
        }
    ]
},
{
    "text": "Qu'est-ce que la rupture de la poche des eaux ?",
    "answers": [
        {
            "text": "La sortie de glaires sanguinolentes.",
            "isCorrect": false,
            "comment": " La rupture des eaux implique la libération d'un liquide clair."
        },
        {
            "text": "La sortie d'un liquide clair.",
            "isCorrect": true,
            "comment": "La rupture de la poche des eaux implique la libération d'un liquide clair."
        },
        {
            "text": "L'ouverture de l'utérus.",
            "isCorrect": false,
            "comment": " La rupture de la poche des eaux précède généralement l'ouverture complète du col de l'utérus."
        },
        {
            "text": "La contraction de l'utérus.",
            "isCorrect": false,
            "comment": " La rupture de la poche des eaux n'est pas une contraction de l'utérus."
        }
    ]
},
{
    "text": "Quelle est la deuxième étape de l'accouchement ?",
    "answers": [
        {
            "text": "Le travail.",
            "isCorrect": false,
            "comment": " Le travail est la première étape de l'accouchement."
        },
        {
            "text": "L'expulsion.",
            "isCorrect": true,
            "comment": "L'expulsion est la deuxième étape de l'accouchement, où le bébé est poussé hors de l'utérus."
        },
        {
            "text": "La délivrance.",
            "isCorrect": false,
            "comment": " La délivrance est la troisième étape de l'accouchement."
        },
        {
            "text": "La contraction.",
            "isCorrect": false,
            "comment": " La contraction est une partie du processus du travail."
        }
    ]
},
{
    "text": "Comment se déroule l'expulsion pendant l'accouchement ?",
    "answers": [
        {
            "text": "La mère pousse vers le haut.",
            "isCorrect": false,
            "comment": " Pendant l'expulsion, la mère pousse généralement vers le bas."
        },
        {
            "text": "La mère pousse vers le bas.",
            "isCorrect": true,
            "comment": "Pendant l'expulsion, la mère pousse généralement vers le bas pour aider le bébé à sortir."
        },
        {
            "text": "La mère pousse sur le côté.",
            "isCorrect": false,
            "comment": " La poussée vers le côté n'est pas une méthode typique pendant l'expulsion."
        },
        {
            "text": "La mère ne pousse pas.",
            "isCorrect": false,
            "comment": " Pendant l'expulsion, la mère est généralement encouragée à pousser pour aider le bébé à sortir."
        }
    ]
},
{
    "text": "Qu'est-ce que la délivrance ?",
    "answers": [
        {
            "text": "La sortie du bébé de l'utérus.",
            "isCorrect": false,
            "comment": " La délivrance ne concerne pas la sortie du bébé, mais plutôt l'expulsion du placenta."
        },
        {
            "text": "La sortie de la poche des eaux.",
            "isCorrect": false,
            "comment": " La délivrance ne concerne pas la sortie de la poche des eaux, mais plutôt l'expulsion du placenta."
        },
        {
            "text": "La sortie du placenta de l'utérus.",
            "isCorrect": true,
            "comment": "La délivrance est la troisième étape de l'accouchement, impliquant l'expulsion du placenta de l'utérus après la naissance du bébé."
        },
        {
            "text": "La sortie des contractions.",
            "isCorrect": false,
            "comment": " La délivrance n'est pas la sortie des contractions, mais plutôt l'expulsion du placenta."
        }
    ]
},
{
    "text": "Quels sont les signes de l'accouchement imminant ?",
    "answers": [
        {
            "text": "La perte de connaissance.",
            "isCorrect": false,
            "comment": " La perte de connaissance n'est pas un signe d'accouchement imminent."
        },
        {
            "text": "Les contractions utérines.",
            "isCorrect": true,
            "comment": "Les contractions utérines sont un signe d'accouchement imminent, indiquant que le travail a commencé."
        },
        {
            "text": "La perte de liquide amniotique.",
            "isCorrect": false,
            "comment": " La perte de liquide amniotique est un signe de rupture de la poche des eaux, mais pas nécessairement un signe d'accouchement imminent."
        },
        {
            "text": "Les convulsions.",
            "isCorrect": false,
            "comment": " Les convulsions ne sont pas un signe d'accouchement imminent."
        }
    ]
},
{
    "text": "Que doit-on faire si le transport de la parturiente peut être réalisé ?",
    "answers": [
        {
            "text": "Réaliser l'accouchement sur place.",
            "isCorrect": false,
            "comment": " Si le transport est possible, la parturiente devrait être transportée vers une installation médicale appropriée pour l'accouchement."
        },
        {
            "text": "Demander une équipe médicale.",
            "isCorrect": false,
            "comment": " Demander une équipe médicale peut être nécessaire, mais la priorité est de transporter la parturiente vers une installation médicale appropriée pour l'accouchement."
        },
        {
            "text": "Installer la parturiente sur un brancard la tête à la place habituelle des pieds.",
            "isCorrect": true,
            "comment": "Lorsque le transport est possible, la parturiente doit être installée sur un brancard avec la tête à la place habituelle des pieds pour prévenir l'aspiration du liquide amniotique ou des sécrétions."
        },
        {
            "text": "Surveiller la parturiente durant le transport.",
            "isCorrect": true,
            "comment": "Pendant le transport, la parturiente doit être surveillée attentivement pour détecter tout signe de complication."
        }
    ]
},
{
    "text": "Quel est le matériel nécessaire pour l'accouchement sur place ?",
    "answers": [
        {
            "text": "Un materkit.",
            "isCorrect": true,
            "comment": " Le terme exact est 'matériel médical d'urgence'."
        },
        {
            "text": "Des pansements.",
            "isCorrect": false,
            "comment": " Les pansements ne sont généralement pas nécessaires lors de l'accouchement."
        },
        {
            "text": "Des serviettes de bain propres et sèches.",
            "isCorrect": true,
            "comment": "Des serviettes de bain propres et sèches peuvent être utilisées pour maintenir l'hygiène pendant l'accouchement sur place."
        },
        {
            "text": "Des bandages.",
            "isCorrect": false,
            "comment": " Les bandages ne sont généralement pas nécessaires lors de l'accouchement, sauf en cas de saignement excessif."
        }
    ]
},
{
    "text": "Quelle est la position recommandée pour la parturiente lors de l'accouchement sur place ?",
    "answers": [
        {
            "text": "Allongée sur le dos.",
            "isCorrect": false,
            "comment": " La position allongée sur le dos n'est pas recommandée pour l'accouchement, car elle peut comprimer les vaisseaux sanguins et réduire l'afflux sanguin vers l'utérus."
        },
        {
            "text": "Assise.",
            "isCorrect": false,
            "comment": " La position assise peut être inconfortable et ne facilite pas l'expulsion du bébé."
        },
        {
            "text": "Debout.",
            "isCorrect": false,
            "comment": " La position debout peut être difficile à maintenir pendant l'accouchement et ne favorise pas l'expulsion du bébé."
        },
        {
            "text": "Demi-assise, cuisses fléchies et écartées.",
            "isCorrect": true,
            "comment": "Cette position facilite l'ouverture du bassin et l'expulsion du bébé pendant l'accouchement sur place."
        }
    ]
},
{
    "text": "Comment doit-on aider la mère pendant l'accouchement ?",
    "answers": [
        {
            "text": "En la laissant seule.",
            "isCorrect": false,
            "comment": " Pendant l'accouchement, la mère a besoin de soutien et d'encouragement."
        },
        {
            "text": "En lui demandant de pousser vers le bas lors des contractions.",
            "isCorrect": true,
            "comment": "Encourager la mère à pousser vers le bas pendant les contractions peut aider à expulser le bébé."
        },
        {
            "text": "En lui donnant à boire.",
            "isCorrect": false,
            "comment": " Il est important de maintenir la mère hydratée pendant l'accouchement, mais cela ne constitue pas une aide principale pendant l'expulsion du bébé."
        },
        {
            "text": "En la plaçant sur le ventre.",
            "isCorrect": false,
            "comment": " La position sur le ventre n'est généralement pas recommandée pendant l'accouchement, car elle peut entraver la respiration de la mère."
        }
    ]
},
{
    "text": "Que doit-on faire dès que la moitié de la tête du bébé est apparue ?",
    "answers": [
        {
            "text": "Faire sortir rapidement le bébé.",
            "isCorrect": false,
            "comment": " Il est important de procéder avec prudence et de ne pas précipiter l'accouchement, surtout si le professionnel de santé n'est pas présent."
        },
        {
            "text": "Cesser de faire pousser la mère.",
            "isCorrect": true,
            "comment": "Il est essentiel de cesser de faire pousser la mère dès que la tête du bébé commence à sortir pour éviter les déchirures du périnée."
        },
        {
            "text": "Faire une incision.",
            "isCorrect": false,
            "comment": " Faire une incision n'est généralement pas nécessaire et ne doit être effectué que par du personnel médical qualifié dans des situations spécifiques."
        },
        {
            "text": "Demander un avis médical.",
            "isCorrect": false,
            "comment": " Si le professionnel de santé n'est pas déjà présent, il peut être difficile de solliciter un avis médical immédiat dans ce cas. Cesser de faire pousser la mère est la meilleure action à entreprendre dans l'immédiat."
        }
    ]
},
{
    "text": "Quelle est la dernière étape de l'accouchement inopiné ?",
    "answers": [
        {
            "text": "L'expulsion.",
            "isCorrect": false,
            "comment": " L'expulsion est la deuxième étape de l'accouchement. La dernière étape est la délivrance, qui consiste en l'expulsion du placenta."
        },
        {
            "text": "La délivrance.",
            "isCorrect": true,
            "comment": "La délivrance est la dernière étape de l'accouchement inopiné, impliquant l'expulsion du placenta de l'utérus après la naissance du bébé."
        },
        {
            "text": "L'administration de médicaments.",
            "isCorrect": false,
            "comment": " L'administration de médicaments peut être nécessaire à différents moments de l'accouchement, mais ce n'est pas la dernière étape."
        },
        {
            "text": "Le transport à l'hôpital.",
            "isCorrect": false,
            "comment": " Le transport à l'hôpital peut être effectué après la délivrance, mais ce n'est pas la dernière étape de l'accouchement lui-même."
        }
    ]
},
{
    "text": "Quelle est la méthode recommandée pour aider la future maman à pousser pendant l'accouchement ?",
    "answers": [
        {
            "text": "Lui demander de retenir sa respiration et de pousser vers le haut.",
            "isCorrect": false,
            "comment": " Retenir sa respiration et pousser vers le haut n'est pas une méthode recommandée, car cela peut augmenter la pression intra-abdominale et compromettre le flux sanguin vers le bébé."
        },
        {
            "text": "Lui demander de pousser vers le bas en retenant sa respiration dès qu'elle ressent la contraction.",
            "isCorrect": true,
            "comment": "Pousser vers le bas pendant les contractions en retenant sa respiration peut aider à expulser le bébé de manière contrôlée."
        },
        {
            "text": "Lui demander de respirer rapidement.",
            "isCorrect": false,
            "comment": " Respirer rapidement n'est pas une méthode efficace pour pousser pendant l'accouchement, car cela ne crée pas suffisamment de pression pour expulser le bébé."
        },
        {
            "text": "Lui demander de se calmer et de ne pas pousser.",
            "isCorrect": false,
            "comment": " Demander à la future maman de ne pas pousser peut retarder l'accouchement et causer des complications."
        }
    ]
},
{
    "text": "Quelle précaution doit-on prendre lors de l'expulsion de la tête du bébé ?",
    "answers": [
        {
            "text": "Tirer sur la tête du bébé pour l'aider à sortir plus rapidement.",
            "isCorrect": false,
            "comment": " Il ne faut jamais tirer sur la tête du bébé lors de l'accouchement, car cela peut causer des blessures graves à la mère et au bébé."
        },
        {
            "text": "Utiliser un instrument pour élargir le passage.",
            "isCorrect": false,
            "comment": " L'utilisation d'instruments pour élargir le passage n'est pas recommandée, sauf dans des cas très spécifiques et sous la supervision d'un professionnel de santé qualifié."
        },
        {
            "text": "Laisser sortir la tête naturellement en la soutenant pour éviter les déchirures du périnée.",
            "isCorrect": true,
            "comment": "Il est essentiel de permettre à la tête du bébé de sortir naturellement, en la soutenant délicatement pour éviter les déchirures du périnée."
        },
        {
            "text": "Arrêter les contractions pour éviter les risques.",
            "isCorrect": false,
            "comment": " Arrêter les contractions pendant l'expulsion peut compliquer l'accouchement et augmenter les risques pour la mère et le bébé."
        }
    ]
},
{
    "text": "Que doit-on faire une fois que la tête du bébé est totalement sortie ?",
    "answers": [
        {
            "text": "Attendre que le bébé sorte complètement tout seul.",
            "isCorrect": false,
            "comment": " Une fois que la tête du bébé est sortie, il est important de continuer le processus d'accouchement en soutenant doucement le reste du corps du bébé."
        },
        {
            "text": "Faire sortir rapidement le bébé.",
            "isCorrect": false,
            "comment": " Bien que le processus d'accouchement doive se dérouler sans précipitation, il est important de continuer à assister le bébé à sortir délicatement."
        },
        {
            "text": "Vérifier l’absence d'un cordon ombilical autour du cou du bébé.",
            "isCorrect": true,
            "comment": "Il est crucial de vérifier immédiatement s'il y a un enroulement du cordon ombilical autour du cou du bébé et de le retirer avec précaution si nécessaire pour éviter les complications."
        },
        {
            "text": "Continuer à pousser la mère pour accélérer l'expulsion.",
            "isCorrect": false,
            "comment": " Une fois que la tête du bébé est sortie, il n'est plus nécessaire de demander à la mère de pousser. L'expulsion du reste du corps du bébé doit être assistée avec précaution."
        }
    ]
},
{
    "text": "Quels équipements sont nécessaires pour une éventuelle réanimation du nouveau-né ?",
    "answers": [
        {
            "text": "Un téléphone portable.",
            "isCorrect": false,
            "comment": " Un téléphone portable peut être utile pour appeler les secours, mais il n'est pas un équipement médical pour la réanimation d'un nouveau-né."
        },
        {
            "text": "Une bouteille d'oxygène, un insufflateur manuel nourrisson, un aspirateur de mucosités et un oxymètre de pouls.",
            "isCorrect": true,
            "comment": "Ces équipements sont nécessaires pour fournir une assistance respiratoire et surveiller les signes vitaux du nouveau-né lors de la réanimation."
        },
        {
            "text": "Un thermomètre.",
            "isCorrect": false,
            "comment": " Un thermomètre peut être utile pour surveiller la température du nouveau-né, mais il n'est pas essentiel pour la réanimation."
        },
        {
            "text": "Des compresses stériles.",
            "isCorrect": false,
            "comment": " Les compresses stériles peuvent être utilisées pour d'autres aspects des soins du nouveau-né, mais elles ne sont pas spécifiques à la réanimation."
        }
    ]
},
{
    "text": "Quel est le matériel nécessaire pour l'accouchement sur place ?",
    "answers": [
        {
            "text": "Un materkit.",
            "isCorrect": true,
            "comment": "Un materkit contenant des fournitures médicales nécessaires à l'accouchement sur place est essentiel pour assurer la sécurité de la mère et du bébé."
        },
        {
            "text": "Des pansements.",
            "isCorrect": false,
            "comment": " Les pansements peuvent être utiles pour d'autres situations médicales, mais ils ne sont pas spécifiquement nécessaires pour l'accouchement sur place."
        },
        {
            "text": "Des serviettes de bain propres et sèches.",
            "isCorrect": true,
            "comment": "Des serviettes de bain propres et sèches peuvent être utilisées pour aider à maintenir la propreté pendant l'accouchement sur place."
        },
        {
            "text": "Des bandages.",
            "isCorrect": false,
            "comment": " Les bandages peuvent être nécessaires pour d'autres blessures, mais ils ne sont pas spécifiquement nécessaires pour l'accouchement sur place."
        }
    ]
},
{
    "text": "Comment doit-on aider la mère pendant l'accouchement ?",
    "answers": [
        {
            "text": "En la laissant seule.",
            "isCorrect": false,
            "comment": " Pendant l'accouchement, il est crucial de soutenir et d'assister la mère à chaque étape du processus."
        },
        {
            "text": "En lui demandant de pousser vers le bas lors des contractions.",
            "isCorrect": true,
            "comment": "Encourager la mère à pousser vers le bas lors des contractions peut aider à faciliter l'expulsion du bébé."
        },
        {
            "text": "En lui donnant à boire.",
            "isCorrect": false,
            "comment": " Pendant l'accouchement, la mère peut être limitée dans sa capacité à boire, en particulier si elle est proche de la naissance du bébé."
        },
        {
            "text": "En la plaçant sur le ventre.",
            "isCorrect": false,
            "comment": " Placer la mère sur le ventre n'est généralement pas recommandé pendant l'accouchement, car cela peut être inconfortable et peu pratique."
        }
    ]
},
{
  "text": "Quelles sont les principales choses à examiner chez le nouveau-né pour déterminer s'il est en bonne santé ?",
  "answers": [
      {
          "text": "Son cri ou sa respiration, son tonus et sa couleur de peau.",
          "isCorrect": true,
          "comment": "L'évaluation du cri ou de la respiration, du tonus musculaire et de la couleur de peau permet de déterminer l'état de santé du nouveau-né."
      },
      {
          "text": "Son poids et sa taille.",
          "isCorrect": false,
          "comment": " Bien que le poids et la taille soient des mesures importantes, ils ne reflètent pas directement l'état de santé immédiat du nouveau-né."
      },
      {
          "text": "Son activité motrice.",
          "isCorrect": false,
          "comment": " L'activité motrice peut être évaluée mais elle seule ne suffit pas à déterminer l'état de santé global du nouveau-né."
      },
      {
          "text": "Sa température corporelle.",
          "isCorrect": false,
          "comment": " Bien que la température corporelle soit importante, elle ne constitue qu'un aspect de l'évaluation de la santé du nouveau-né."
      }
  ]
},
{
  "text": "Quand doit-on clamper le cordon ombilical pour un nouveau-né en bonne santé ?",
  "answers": [
      {
          "text": "Au minimum après 1 minute de vie.",
          "isCorrect": true,
          "comment": "Il est recommandé de clamper le cordon ombilical au minimum après 1 minute de vie pour permettre le transfert optimal de sang vers le nouveau-né."
      },
      {
          "text": "Immédiatement après la naissance.",
          "isCorrect": false,
          "comment": " Clamper le cordon immédiatement peut priver le nouveau-né d'une quantité importante de sang."
      },
      {
          "text": "Après 30 secondes de vie.",
          "isCorrect": false,
          "comment": " Attendre au moins 1 minute permet un meilleur transfert de sang vers le nouveau-né."
      },
      {
          "text": "Une fois que le bébé a été séché.",
          "isCorrect": false,
          "comment": " L'ordre des interventions recommandé est de clamper le cordon puis de sécher le bébé."
      }
  ]
},
{
  "text": "Que faut-il faire si le nouveau-né ne respire pas ou ne présente pas de cri à la naissance ?",
  "answers": [
      {
          "text": "Commencer immédiatement les manœuvres de réanimation pour permettre au nouveau-né de respirer.",
          "isCorrect": true,
          "comment": "L'absence de respiration ou de cri nécessite une intervention immédiate pour assurer la ventilation du nouveau-né."
      },
      {
          "text": "Attendre quelques minutes pour voir s'il réagit.",
          "isCorrect": false,
          "comment": " L'absence de respiration ou de cri nécessite une intervention rapide pour éviter les complications."
      },
      {
          "text": "Clamper le cordon et placer le bébé sur une surface plane avant de commencer les manœuvres de réanimation.",
          "isCorrect": false,
          "comment": " L'intervention la plus urgente est de commencer les manœuvres de réanimation pour assurer la respiration du nouveau-né."
      },
      {
          "text": "Demander un avis médical sans commencer de manœuvres de réanimation.",
          "isCorrect": false,
          "comment": " En cas d'absence de respiration ou de cri, des mesures immédiates doivent être prises pour assurer la survie du nouveau-né."
      }
  ]
},
{
  "text": "Comment doit-on évaluer l'état du nouveau-né pendant la réanimation cardio-pulmonaire ?",
  "answers": [
      {
          "text": "Toutes les minutes.",
          "isCorrect": true,
          "comment": "Pendant la réanimation, l'état du nouveau-né doit être évalué toutes les minutes pour ajuster les interventions en fonction de sa réponse."
      },
      {
          "text": "Toutes les heures.",
          "isCorrect": false,
          "comment": " Une évaluation toutes les heures serait trop espacée pour détecter rapidement les changements dans l'état du nouveau-né pendant la réanimation."
      },
      {
          "text": "Toutes les 5 minutes.",
          "isCorrect": false,
          "comment": " Une évaluation toutes les 5 minutes pourrait ne pas être suffisante pour détecter rapidement les changements dans l'état du nouveau-né pendant la réanimation."
      },
      {
          "text": "Toutes les 10 minutes.",
          "isCorrect": false,
          "comment": " Une évaluation toutes les 10 minutes serait trop espacée pour détecter rapidement les changements dans l'état du nouveau-né pendant la réanimation."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en fonction de la fréquence cardiaque du nouveau-né ?",
  "answers": [
      {
          "text": "Si la fréquence cardiaque est inférieure à 60 battements par minute, réaliser une RCP sans DAE, avec un apport complémentaire d'oxygène.",
          "isCorrect": true,
          "comment": "Une fréquence cardiaque inférieure à 60 bpm nécessite des mesures de réanimation, y compris un apport d'oxygène supplémentaire."
      },
      {
          "text": "Si la fréquence cardiaque est entre 60 et 100 battements par minute, réaliser des compressions thoraciques.",
          "isCorrect": false,
          "comment": " Une fréquence cardiaque entre 60 et 100 bpm est généralement considérée comme normale chez un nouveau-né en bonne santé et ne nécessite pas de compressions thoraciques."
      },
      {
          "text": "Si la fréquence cardiaque est supérieure à 100 battements par minute, ne pas surveiller étroitement le nouveau-né.",
          "isCorrect": false,
          "comment": " Une fréquence cardiaque supérieure à 100 bpm peut nécessiter une surveillance étroite pour détecter d'autres problèmes potentiels."
      },
      {
          "text": "Si la fréquence cardiaque est inférieure à 60 battements par minute, réaliser une RCP sans apport complémentaire d'oxygène.",
          "isCorrect": false,
          "comment": " En cas de fréquence cardiaque inférieure à 60 bpm, un apport supplémentaire d'oxygène est nécessaire pour soutenir la réanimation."
      }
  ]
},
{
  "text": "Quelle est la première étape à réaliser lorsque le nouveau-né est en bonne santé et présente un cri vigoureux ?",
  "answers": [
      {
          "text": "Couvrir la mère.",
          "isCorrect": false,
          "comment": " La première étape consiste à libérer les voies aériennes du bébé pour assurer sa respiration et sa santé immédiate."
      },
      {
          "text": "Libérer les voies aériennes du bébé.",
          "isCorrect": true,
          "comment": "La première étape est de s'assurer que les voies aériennes du nouveau-né sont dégagées pour faciliter sa respiration."
      },
      {
          "text": "Demander un avis médical.",
          "isCorrect": false,
          "comment": " En présence d'un cri vigoureux, il n'est pas nécessaire de demander un avis médical immédiat."
      },
      {
          "text": "Réaliser des compressions thoraciques.",
          "isCorrect": false,
          "comment": " Les compressions thoraciques ne sont pas nécessaires chez un nouveau-né en bonne santé et présentant un cri vigoureux."
      }
  ]
},
{
  "text": "Pourquoi est-il important de protéger le nouveau-né contre le froid après la naissance ?",
  "answers": [
      {
          "text": "Pour éviter qu'il ne se réchauffe trop rapidement.",
          "isCorrect": false,
          "comment": " Après la naissance, le nouveau-né peut avoir du mal à maintenir sa propre température corporelle et peut nécessiter une protection contre le froid pour éviter l'hypothermie."
      },
      {
          "text": "Pour prévenir les infections.",
          "isCorrect": false,
          "comment": " La protection contre le froid vise principalement à maintenir la température corporelle du nouveau-né et ne vise pas spécifiquement à prévenir les infections."
      },
      {
          "text": "Pour maintenir sa température corporelle.",
          "isCorrect": true,
          "comment": "Il est important de protéger le nouveau-né contre le froid pour maintenir sa température corporelle et prévenir l'hypothermie, car les nouveau-nés ont du mal à réguler leur température corporelle après la naissance."
      },
      {
          "text": "Pour favoriser son sommeil.",
          "isCorrect": false,
          "comment": " Bien que le confort thermique puisse influencer le sommeil du nouveau-né, la principale raison de la protection contre le froid est de maintenir sa température corporelle."
      }
  ]
},
{
  "text": "Quels sont les signes qui peuvent indiquer que le nouveau-né n'est pas en bonne santé ?",
  "answers": [
      {
          "text": "Il ne pleure pas.",
          "isCorrect": false,
          "comment": " Bien que le cri vigoureux soit un bon signe de santé chez le nouveau-né, l'absence de cri n'est pas le seul indicateur de mauvaise santé."
      },
      {
          "text": "Il ne respire pas ou présente une respiration anormale.",
          "isCorrect": true,
          "comment": "La respiration est un indicateur important de la santé du nouveau-né. Une respiration anormale ou l'absence de respiration peuvent indiquer des problèmes de santé."
      },
      {
          "text": "Il ne bouge pas.",
          "isCorrect": false,
          "comment": " Bien que le tonus musculaire soit important, l'absence de mouvement ne constitue pas nécessairement un signe de mauvaise santé."
      },
      {
          "text": "Tous les choix ci-dessus.",
          "isCorrect": false,
          "comment": " Bien que ces éléments puissent indiquer une mauvaise santé chez le nouveau-né, il peut y avoir d'autres signes à prendre en compte également."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir si l'état du nouveau-né s'améliore pendant la réanimation cardio-pulmonaire ?",
  "answers": [
      {
          "text": "Arrêter immédiatement la réanimation.",
          "isCorrect": false,
          "comment": " Même si l'état du nouveau-né s'améliore, il est important de poursuivre la réanimation jusqu'à ce que l'évaluation médicale confirme qu'elle n'est plus nécessaire."
      },
      {
          "text": "Continuer la réanimation jusqu'à ce qu'un médecin arrive.",
          "isCorrect": false,
          "comment": " La décision de continuer ou d'arrêter la réanimation ne dépend pas uniquement de l'arrivée d'un médecin, mais plutôt de l'évaluation continue de l'état du nouveau-né."
      },
      {
          "text": "Assurer une surveillance étroite de sa respiration.",
          "isCorrect": true,
          "comment": "En cas d'amélioration de l'état du nouveau-né pendant la réanimation, il est important de surveiller étroitement sa respiration et de continuer la réanimation si nécessaire."
      },
      {
          "text": "Recommencer la réanimation à un rythme plus rapide.",
          "isCorrect": false,
          "comment": " Le rythme de la réanimation doit être adapté à l'état du nouveau-né, et une amélioration de l'état ne nécessite pas nécessairement un rythme plus rapide de réanimation."
      }
  ]
},
{
  "text": "Quand doit-on réaliser le clampage et la section du cordon ombilical ?",
  "answers": [
      {
          "text": "Avant la naissance.",
          "isCorrect": false,
          "comment": " Le clampage et la section du cordon ombilical sont réalisés après la naissance."
      },
      {
          "text": "Après la naissance, après la 1ère minute de vie.",
          "isCorrect": true,
          "comment": "Le clampage et la section du cordon ombilical sont effectués après la naissance, généralement après la première minute de vie."
      },
      {
          "text": "Pendant la grossesse.",
          "isCorrect": false,
          "comment": " Le clampage et la section du cordon ombilical se produisent après la naissance."
      },
      {
          "text": "Après la naissance, avant la 1ère minute de vie.",
          "isCorrect": false,
          "comment": " Le clampage et la section du cordon ombilical se font après la naissance, pas avant."
      }
  ]
},
{
  "text": "Quel est l'objectif du clampage du cordon ombilical ?",
  "answers": [
      {
          "text": "Empêcher la circulation sanguine.",
          "isCorrect": false,
          "comment": " Le clampage du cordon ombilical facilite l'adaptation du nouveau-né à la vie extra-utérine, mais n'arrête pas la circulation sanguine."
      },
      {
          "text": "Faciliter l'adaptation du nouveau-né à la vie extra-utérine.",
          "isCorrect": true,
          "comment": "Le clampage du cordon ombilical aide le nouveau-né à s'adapter à sa nouvelle vie en coupant le lien physique avec la mère."
      },
      {
          "text": "Prévenir l'hypothermie chez la mère.",
          "isCorrect": false,
          "comment": " Le clampage du cordon ombilical n'a pas pour but de prévenir l'hypothermie chez la mère."
      },
      {
          "text": "Favoriser le développement du fœtus.",
          "isCorrect": false,
          "comment": " Le clampage du cordon ombilical intervient après la naissance."
      }
  ]
},
{
  "text": "Quel matériel est nécessaire pour réaliser la section du cordon ombilical ?",
  "answers": [
      {
          "text": "Des compresses stériles, deux clamps de Barr, et une paire de ciseaux stériles.",
          "isCorrect": true,
          "comment": "Ces éléments sont nécessaires pour réaliser la section du cordon ombilical et assurer une coupe propre et stérile."
      },
      {
          "text": "Des compresses usagées, un bandage et une paire de gants.",
          "isCorrect": false,
          "comment": " Des équipements stériles sont nécessaires pour éviter les infections."
      },
      {
          "text": "Des lingettes désinfectantes et un masque chirurgical.",
          "isCorrect": false,
          "comment": " Ces articles ne sont pas suffisants pour réaliser une section du cordon ombilical."
      },
      {
          "text": "Une bouteille de désinfectant et un tissu propre.",
          "isCorrect": false,
          "comment": " Ces éléments ne sont pas adaptés pour la section du cordon ombilical."
      }
  ]
},
{
  "text": "Comment procède-t-on pour réaliser la section du cordon ombilical ?",
  "answers": [
      {
          "text": "On sectionne directement sans clampage.",
          "isCorrect": false,
          "comment": " Le clampage est réalisé avant la section du cordon ombilical."
      },
      {
          "text": "On sectionne entre les clamps.",
          "isCorrect": true,
          "comment": "La section du cordon ombilical se fait entre deux clamps stériles pour assurer une coupe propre et contrôlée."
      },
      {
          "text": "On sectionne le cordon avant de le pincer.",
          "isCorrect": false,
          "comment": " Le clampage précède la section du cordon ombilical."
      },
      {
          "text": "On sectionne avec des ciseaux non stériles.",
          "isCorrect": false,
          "comment": " Des ciseaux stériles sont nécessaires pour éviter les infections."
      }
  ]
},
{
  "text": "Quelle est la conduite à adopter si le nouveau-né est en détresse et nécessite une réanimation ?",
  "answers": [
      {
          "text": "Attendre l'arrivée des secours sans intervention.",
          "isCorrect": false,
          "comment": " Une réanimation immédiate est nécessaire en cas de détresse du nouveau-né."
      },
      {
          "text": "Réaliser la section du cordon rapidement sans prendre de précautions.",
          "isCorrect": false,
          "comment": " Une réanimation appropriée est prioritaire."
      },
      {
          "text": "Mettre des gants propres et procéder à la section du cordon sans désinfection.",
          "isCorrect": true,
          "comment": "La priorité est de mettre des gants propres avant toute intervention."
      },
      {
          "text": "Arrêter toute manipulation jusqu'à l'arrivée des secours.",
          "isCorrect": false,
          "comment": " Une action immédiate est nécessaire en cas de détresse."
      }
  ]
},
{
  "text": "Quel est le but de la pince du cordon ombilical ?",
  "answers": [
      {
          "text": "Faciliter l'accouchement.",
          "isCorrect": false,
          "comment": " La pince du cordon ombilical n'a pas pour but de faciliter l'accouchement."
      },
      {
          "text": "Prévenir l'hypothermie chez le nouveau-né.",
          "isCorrect": false,
          "comment": " La pince du cordon ombilical ne prévient pas l'hypothermie chez le nouveau-né."
      },
      {
          "text": "Permettre l'expulsion du nouveau-né en présence d'une circulaire du cordon.",
          "isCorrect": true,
          "comment": "La pince du cordon ombilical permet de libérer le cordon lorsqu'il y a une circulaire, facilitant ainsi l'expulsion du nouveau-né."
      },
      {
          "text": "Empêcher la circulation sanguine.",
          "isCorrect": false,
          "comment": " La pince du cordon ombilical ne vise pas à empêcher la circulation sanguine, mais plutôt à permettre l'expulsion du nouveau-né."
      }
  ]
},
{
  "text": "Quels sont les risques associés à une mauvaise section du cordon ombilical ?",
  "answers": [
      {
          "text": "Saignement excessif après la section.",
          "isCorrect": false,
          "comment": " Un saignement excessif n'est pas un risque majeur associé à une mauvaise section du cordon ombilical."
      },
      {
          "text": "Infection du cordon.",
          "isCorrect": false,
          "comment": " Une infection du cordon est possible mais n'est pas le principal risque associé à une mauvaise section du cordon ombilical."
      },
      {
          "text": "Pincement d'une partie d'intestin.",
          "isCorrect": true,
          "comment": "Une mauvaise section du cordon ombilical peut entraîner le pincement d'une partie d'intestin du nouveau-né, ce qui peut être dangereux."
      },
      {
          "text": "Aucun risque.",
          "isCorrect": false,
          "comment": " Une mauvaise section du cordon ombilical comporte des risques potentiels pour le nouveau-né."
      }
  ]
},
{
  "text": "Quelle est la recommandation concernant le positionnement du premier clamp par rapport à l'ombilic ?",
  "answers": [
      {
          "text": "Il doit être placé directement sur l'ombilic.",
          "isCorrect": false,
          "comment": " Placer le clamp directement sur l'ombilic peut entraîner le pincement d'une partie d'intestin."
      },
      {
          "text": "Il doit être suffisamment loin de l'ombilic pour ne pas pincer une partie d'intestin.",
          "isCorrect": true,
          "comment": "Le clamp doit être positionné à une distance suffisante de l'ombilic pour éviter de pincer une partie d'intestin du nouveau-né."
      },
      {
          "text": "Il doit être placé après la section du cordon.",
          "isCorrect": false,
          "comment": " Le premier clamp est positionné avant la section du cordon ombilical."
      },
      {
          "text": "Il doit être placé sur la mère.",
          "isCorrect": false,
          "comment": " Le clamp est placé sur le cordon ombilical du nouveau-né, pas sur la mère."
      }
  ]
},
{
  "text": "Que doit-on faire si le cordon a été rompu avant l'arrivée des secours ?",
  "answers": [
      {
          "text": "Attendre les secours sans intervention.",
          "isCorrect": false,
          "comment": " Une intervention est nécessaire pour sécuriser le cordon ombilical en cas de rupture avant l'arrivée des secours."
      },
      {
          "text": "Poser un clamp sur la partie du cordon reliée au nouveau-né et un autre clamp sur la partie reliée à la mère.",
          "isCorrect": true,
          "comment": "Poser des clamps de chaque côté de la rupture permet de sécuriser le cordon ombilical jusqu'à l'arrivée des secours."
      },
      {
          "text": "Désinfecter la zone sans poser de clamp.",
          "isCorrect": false,
          "comment": " Une désinfection ne suffit pas à sécuriser le cordon ombilical après une rupture."
      },
      {
          "text": "Couper le cordon sans poser de clamp.",
          "isCorrect": false,
          "comment": " Couper le cordon sans poser de clamp peut entraîner des complications pour le nouveau-né."
      }
  ]
},
{
  "text": "Quelle est la première étape pour réaliser la section du cordon ombilical ?",
  "answers": [
      {
          "text": "Couper le cordon entre les clamps.",
          "isCorrect": false,
          "comment": " La première étape est de placer le premier clamp à une distance suffisante de l'ombilic."
      },
      {
          "text": "Pincer le cordon avec une compresse stérile.",
          "isCorrect": false,
          "comment": " La première étape est de placer le premier clamp sur le cordon ombilical, pas de le pincer avec une compresse."
      },
      {
          "text": "Poser le premier clamp à environ 10 à 15 cm de l'ombilic.",
          "isCorrect": true,
          "comment": "La première étape de la section du cordon ombilical est de placer le premier clamp à une distance appropriée de l'ombilic du nouveau-né."
      },
      {
          "text": "Essuyer le cordon avec une compresse.",
          "isCorrect": false,
          "comment": " Avant de procéder à la section du cordon, il est nécessaire de placer les clamps de manière à sécuriser le cordon ombilical."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en cas de circulaire serrée du cordon ?",
  "answers": [
      {
          "text": "Attendre que le cordon se détache naturellement.",
          "isCorrect": false,
          "comment": " Il est nécessaire d'intervenir pour sécuriser le cordon en cas de circulaire serrée."
      },
      {
          "text": "Placer les clamps très près l'un de l'autre.",
          "isCorrect": true,
          "comment": "En cas de circulaire serrée du cordon, il est recommandé de placer les clamps très près l'un de l'autre pour sécuriser le cordon."
      },
      {
          "text": "Couper le cordon à n'importe quel endroit.",
          "isCorrect": false,
          "comment": " Couper le cordon à n'importe quel endroit peut ne pas être sécuritaire en cas de circulaire serrée."
      },
      {
          "text": "Demander l'avis d'un médecin.",
          "isCorrect": false,
          "comment": " Une intervention immédiate est nécessaire en cas de circulaire serrée, plutôt que d'attendre l'avis d'un médecin."
      }
  ]
},
{
  "text": "Quel est le risque associé à la section du cordon ombilical ?",
  "answers": [
      {
          "text": "Infection.",
          "isCorrect": false,
          "comment": " Bien qu'une infection soit possible, ce n'est pas le principal risque associé à la section du cordon ombilical."
      },
      {
          "text": "Hémorragie.",
          "isCorrect": true,
          "comment": "Le principal risque associé à la section du cordon ombilical est l'hémorragie, surtout si elle est mal réalisée."
      },
      {
          "text": "Déshydratation.",
          "isCorrect": false,
          "comment": " La déshydratation n'est pas un risque directement associé à la section du cordon ombilical."
      },
      {
          "text": "Aucun risque.",
          "isCorrect": false,
          "comment": " La section du cordon ombilical comporte des risques potentiels, notamment l'hémorragie."
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
