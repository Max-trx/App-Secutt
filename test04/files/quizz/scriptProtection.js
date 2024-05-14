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
    "text": "Quel équipement est recommandé pour se protéger du risque de contamination par des liquides biologiques lors d'une intervention ?",
    "answers": [
        {
            "text": "Une paire de gants à usage unique.",
            "isCorrect": true,
            "comment": "Effectivement, une paire de gants à usage unique est recommandée pour se protéger du risque de contamination par des liquides biologiques lors d'une intervention, car elle constitue une barrière efficace."
        },
        {
            "text": "Un blouson adapté aux conditions climatiques.",
            "isCorrect": false,
            "comment": "Le port d'un blouson adapté aux conditions climatiques est important pour le confort de l'intervenant, mais il ne protège pas spécifiquement contre le risque de contamination par des liquides biologiques."
        },
        {
            "text": "Une lampe de poche ou frontale.",
            "isCorrect": false,
            "comment": "La lampe de poche ou frontale est utile pour travailler en sécurité dans l'obscurité, mais elle ne protège pas contre le risque de contamination par des liquides biologiques."
        },
        {
            "text": "Des bandes réfléchissantes sur les vêtements.",
            "isCorrect": false,
            "comment": "Les bandes réfléchissantes sur les vêtements améliorent la visibilité du secouriste, mais elles ne sont pas spécifiquement conçues pour protéger contre le risque de contamination par des liquides biologiques."
        }
    ]
},
{
    "text": "Que doit faire l'intervenant en présence de débris de verre ou autres objets perforants lors d'une intervention ?",
    "answers": [
        {
            "text": "Mettre des gants épais de manutention et veiller à ne pas se blesser ou à ne pas blesser accidentellement un tiers.",
            "isCorrect": true,
            "comment": "Effectivement, en présence de débris de verre ou autres objets perforants, l'intervenant doit mettre des gants épais de manutention et veiller à ne pas se blesser ou à ne pas blesser accidentellement un tiers pour se protéger contre les risques de blessures."
        },
        {
            "text": "Utiliser une méthode orale directe de ventilation artificielle.",
            "isCorrect": false,
            "comment": "L'utilisation d'une méthode orale directe de ventilation artificielle n'est pas recommandée en présence de débris de verre ou autres objets perforants, car cela peut augmenter le risque de blessures ou de contamination."
        },
        {
            "text": "Déposer les objets tranchants dans les boîtes de recueil des déchets d'activités de soins.",
            "isCorrect": false,
            "comment": "Bien que le dépôt des objets tranchants dans les boîtes de recueil des déchets d'activités de soins soit une mesure importante, cela ne suffit pas à protéger l'intervenant contre les risques de blessures lors de leur manipulation."
        },
        {
            "text": "Appliquer les précautions standards et particulières pour lutter contre les infections.",
            "isCorrect": false,
            "comment": "L'application des précautions standards et particulières pour lutter contre les infections est une mesure générale de protection, mais elle ne constitue pas une réponse spécifique en présence de débris de verre ou autres objets perforants."
        }
    ]
},
{
    "text": "Quel est l'objectif des techniques de protection utilisables par les intervenants lors d'une prise en charge de victime ?",
    "answers": [
        {
            "text": "Interrompre la transmission d'un germe d'un individu à l'autre et limiter le risque de transmission d'un germe dangereux aux secouristes.",
            "isCorrect": true,
            "comment": "Effectivement, l'objectif des techniques de protection utilisables par les intervenants est d'interrompre la transmission d'un germe d'un individu à l'autre et de limiter le risque de transmission d'un germe dangereux aux secouristes pour prévenir les infections."
        },
        {
            "text": "Réduire le temps d'intervention sur le lieu de l'accident.",
            "isCorrect": false,
            "comment": "La réduction du temps d'intervention sur le lieu de l'accident est importante pour la prise en charge rapide des victimes, mais ce n'est pas l'objectif principal des techniques de protection."
        },
        {
            "text": "Minimiser les coûts liés à la protection individuelle.",
            "isCorrect": false,
            "comment": "La minimisation des coûts liés à la protection individuelle peut être un élément à prendre en compte, mais cela ne constitue pas l'objectif principal des techniques de protection utilisables par les intervenants."
        },
        {
            "text": "Éviter les contraintes de port d'équipements lourds.",
            "isCorrect": false,
            "comment": "Éviter les contraintes de port d'équipements lourds peut être un avantage, mais cela ne constitue pas l'objectif principal des techniques de protection utilisables par les intervenants."
        }
    ]
},
{
    "text": "Pourquoi est-il recommandé d'éviter l'utilisation d'une méthode orale directe de ventilation artificielle en cas de disponibilité d'un moyen de ventilation lors des manœuvres de réanimation ?",
    "answers": [
        {
            "text": "Même si le risque de transmission par la salive est très faible, il faut éviter d'utiliser une méthode orale directe de ventilation artificielle pour limiter les contacts directs entre le secouriste et la victime.",
            "isCorrect": true,
            "comment": "Effectivement, même si le risque de transmission par la salive est très faible, il est recommandé d'éviter d'utiliser une méthode orale directe de ventilation artificielle pour limiter les contacts directs entre le secouriste et la victime, surtout si un moyen de ventilation est disponible."
        },
        {
            "text": "La méthode orale directe de ventilation artificielle est plus efficace que l'utilisation d'un moyen de ventilation.",
            "isCorrect": false,
            "comment": "La méthode orale directe de ventilation artificielle n'est pas nécessairement plus efficace que l'utilisation d'un moyen de ventilation, surtout si les conditions le permettent."
        },
        {
            "text": "L'utilisation d'une méthode orale directe de ventilation artificielle permet de réduire la fatigue du secouriste.",
            "isCorrect": false,
            "comment": "La réduction de la fatigue du secouriste peut être un avantage de l'utilisation d'une méthode orale directe de ventilation artificielle, mais ce n'est pas la principale raison pour éviter son utilisation en cas de disponibilité d'un moyen de ventilation."
        },
        {
            "text": "La méthode orale directe de ventilation artificielle est plus rapide à mettre en œuvre que l'utilisation d'un moyen de ventilation.",
            "isCorrect": false,
            "comment": "La rapidité de mise en œuvre n'est pas le principal critère pour choisir entre la méthode orale directe de ventilation artificielle et l'utilisation d'un moyen de ventilation lors des manœuvres de réanimation."
        }
    ]
},
{
    "text": "Quelle est la première étape recommandée pour assurer la sécurité sur le lieu d'intervention ?",
    "answers": [
        {
            "text": "Effectuer une approche prudente de la zone de l’accident afin d’évaluer les dangers potentiels pour les intervenants et les témoins.",
            "isCorrect": true,
            "comment": "Effectivement, la première étape recommandée pour assurer la sécurité sur le lieu d'intervention est d'effectuer une approche prudente de la zone de l’accident afin d’évaluer les dangers potentiels pour les intervenants et les témoins."
        },
        {
            "text": "Mettre en place les moyens de protection collective en dotation.",
            "isCorrect": false,
            "comment": "Mettre en place les moyens de protection collective en dotation est une étape ultérieure dans le processus de sécurisation du lieu d'intervention, mais ce n'est pas la première étape recommandée."
        },
        {
            "text": "Repérer les personnes exposées aux dangers et leur demander de quitter la zone d'intervention.",
            "isCorrect": false,
            "comment": "Bien que repérer les personnes exposées aux dangers soit important, cela ne constitue pas la première étape recommandée pour assurer la sécurité sur le lieu d'intervention."
        },
        {
            "text": "Réaliser un dégagement d'urgence de la victime en cas de danger imminent.",
            "isCorrect": false,
            "comment": "Réaliser un dégagement d'urgence de la victime en cas de danger imminent est une mesure spécifique qui peut être prise dans certaines situations, mais ce n'est pas la première étape recommandée pour assurer la sécurité sur le lieu d'intervention."
        }
    ]
},
{
    "text": "Quelle action les intervenants doivent-ils réaliser en cas d'impossibilité ou de danger réel et imminent pour la victime ?",
    "answers": [
        {
            "text": "Réaliser un dégagement d’urgence.",
            "isCorrect": true,
            "comment": "Effectivement, en cas d'impossibilité ou de danger réel et imminent pour la victime, les intervenants doivent réaliser un dégagement d’urgence pour la mettre en sécurité."
        },
        {
            "text": "Mettre en place les moyens de protection collective en dotation.",
            "isCorrect": false,
            "comment": "Mettre en place les moyens de protection collective en dotation est une mesure importante, mais ce n'est pas la réponse appropriée en cas d'impossibilité ou de danger réel et imminent pour la victime."
        },
        {
            "text": "Délimiter clairement la zone d’intervention et empêcher toute intrusion.",
            "isCorrect": false,
            "comment": "Délimiter clairement la zone d’intervention et empêcher toute intrusion est une mesure générale de sécurité, mais ce n'est pas la réponse appropriée en cas d'impossibilité ou de danger réel et imminent pour la victime."
        },
        {
            "text": "Repérer les personnes exposées aux dangers et leur demander de quitter la zone d'intervention.",
            "isCorrect": false,
            "comment": "Repérer les personnes exposées aux dangers et leur demander de quitter la zone d'intervention est une mesure importante, mais ce n'est pas la réponse appropriée en cas d'impossibilité ou de danger réel et imminent pour la victime."
        }
    ]
},
{
    "text": "Comment les intervenants doivent-ils réagir si une personne extérieure peut apporter une aide dans la mise en œuvre de la protection sur le lieu d'intervention ?",
    "answers": [
        {
            "text": "Ils doivent utiliser tous les moyens matériels dont ils peuvent disposer et s’assurer si besoin du concours de toute autre personne qui pourrait apporter une aide dans la mise en œuvre de cette protection.",
            "isCorrect": true,
            "comment": "Effectivement, les intervenants doivent utiliser tous les moyens matériels dont ils peuvent disposer et s’assurer si besoin du concours de toute autre personne qui pourrait apporter une aide dans la mise en œuvre de cette protection, afin d'optimiser la sécurité sur le lieu d'intervention."
        },
        {
            "text": "Ils doivent se concentrer uniquement sur les moyens de protection collective en dotation.",
            "isCorrect": false,
            "comment": "Se concentrer uniquement sur les moyens de protection collective en dotation peut limiter les possibilités d'optimiser la sécurité sur le lieu d'intervention en n'utilisant pas toutes les ressources disponibles."
        },
        {
            "text": "Ils doivent demander l'assistance du service de sécurité publique le plus proche.",
            "isCorrect": false,
            "comment": "Demander l'assistance du service de sécurité publique le plus proche peut être une mesure appropriée dans certaines situations, mais ce n'est pas nécessairement la réponse la plus efficace pour obtenir une aide immédiate dans la mise en œuvre de la protection sur le lieu d'intervention."
        },
        {
            "text": "Ils doivent attendre les instructions du médecin régulateur avant d'agir.",
            "isCorrect": false,
            "comment": "Attendre les instructions du médecin régulateur peut entraîner des retards dans la mise en œuvre des mesures de protection, ce qui peut compromettre la sécurité sur le lieu d'intervention."
        }
    ]
},
{
    "text": "Que faut-il faire si une personne est en contact avec un appareil électrique lors d'un accident électrique ?",
    "answers": [
        
        {
            "text": "S'approcher de la victime immédiatement et la toucher pour évaluer ses blessures.",
            "isCorrect": false,
            "comment": "S'approcher de la victime immédiatement et la toucher sans avoir coupé le courant ou débranché l'appareil peut aggraver la situation en augmentant le risque de choc électrique."
        },
        {
            "text": "Utiliser un extincteur pour éteindre les flammes si la victime est en feu.",
            "isCorrect": false,
            "comment": "Utiliser un extincteur pour éteindre les flammes n'est pas approprié en cas d'accident électrique, car cela peut aggraver les blessures de la victime en augmentant le risque de choc électrique."
        },
  {
            "text": "Couper le courant (disjoncteur) ou débrancher l'appareil en cause avant de s'approcher ou de toucher la victime.",
            "isCorrect": true,
            "comment": "Effectivement, en cas d'accident électrique, il est essentiel de couper le courant ou de débrancher l'appareil en cause avant de s'approcher ou de toucher la victime pour éviter tout risque supplémentaire."
        },
        {
            "text": "Attendre l'arrivée des équipes spécialisées pour intervenir.",
            "isCorrect": false,
            "comment": "Attendre l'arrivée des équipes spécialisées peut prendre du temps, et dans une situation d'urgence, chaque instant compte pour assurer la sécurité de la victime."
        }
    ]
},
{
    "text": "Quelle est la première action à entreprendre pour se protéger lors d'un accident de la route en tant qu'intervenant ?",
    "answers": [
        
        {
            "text": "Sortir immédiatement du véhicule pour porter assistance aux victimes.",
            "isCorrect": false,
            "comment": "Sortir immédiatement du véhicule sans prendre les mesures de sécurité appropriées peut augmenter les risques pour l'intervenant et les autres usagers de la route."
        },
        {
            "text": "Se garer devant le lieu de l'accident pour faciliter l'accès aux victimes.",
            "isCorrect": false,
            "comment": "Se garer devant le lieu de l'accident peut entraver la circulation et aggraver la situation en créant un obstacle pour les secours et les autres usagers de la route."
        },
        {
            "text": "Mettre un gilet de sécurité haute visibilité avant de quitter le véhicule.",
            "isCorrect": false,
            "comment": "Mettre un gilet de sécurité haute visibilité est une mesure importante, mais ce n'est pas la première action à entreprendre pour se protéger lors d'un accident de la route en tant qu'intervenant."
        },
  {
            "text": "Allumer les feux de détresse du véhicule et ralentir en approchant du lieu de l'accident.",
            "isCorrect": true,
            "comment": "Effectivement, la première action à entreprendre pour se protéger lors d'un accident de la route en tant qu'intervenant est d'allumer les feux de détresse du véhicule et de ralentir en approchant du lieu de l'accident pour signaler sa présence aux autres usagers de la route."
        },
    ]
},
{
    "text": "Que doit faire un intervenant en cas de fuite de gaz suspectée dans un local ?",
    "answers": [
        {
            "text": "Ne pas pénétrer dans le local, rester à distance, empêcher l'accès, et ne pas provoquer d'étincelles.",
            "isCorrect": true,
            "comment": "Effectivement, en cas de fuite de gaz suspectée dans un local, il est important de ne pas pénétrer dans le local, de rester à distance, d'empêcher l'accès, et de ne pas provoquer d'étincelles pour éviter tout risque d'explosion ou d'incendie."
        },
        {
            "text": "Pénétrer dans le local pour évaluer l'ampleur de la fuite et arrêter la source de gaz.",
            "isCorrect": false,
            "comment": "Pénétrer dans le local sans équipement de protection adéquat peut mettre l'intervenant en danger et aggraver la situation en cas de fuite de gaz."
        },
        {
            "text": "Allumer une lampe de poche pour éclairer le local et rechercher la source de la fuite.",
            "isCorrect": false,
            "comment": "Allumer une lampe de poche peut provoquer des étincelles et aggraver la situation en cas de fuite de gaz."
        },
        {
            "text": "Contacter les sapeurs-pompiers et leur indiquer la présence d'une fuite de gaz.",
            "isCorrect": false,
            "comment": "Contacter les sapeurs-pompiers est une mesure importante, mais ce n'est pas la seule action à entreprendre en cas de fuite de gaz suspectée dans un local."
        }
    ]
},
{
    "text": "Que doit faire un intervenant en présence d'une victime dont les vêtements sont en feu ?",
    "answers": [
        
        {
            "text": "S'éloigner de la victime pour éviter toute blessure due aux flammes.",
            "isCorrect": false,
            "comment": "S'éloigner de la victime sans lui porter secours peut aggraver ses blessures et compromettre sa survie en cas d'incendie."
        },
        {
            "text": "Utiliser de l'eau pour éteindre les flammes sur la victime.",
            "isCorrect": false,
            "comment": "Utiliser de l'eau pour éteindre les flammes sur la victime peut aggraver ses blessures en augmentant la propagation du feu et en causant des brûlures par la chaleur de l'eau."
        },
{
            "text": "Allonger la victime sur le sol et éteindre les flammes avec un extincteur approprié (couleur verte) si disponible, sinon utiliser une couverture ou un manteau pour éteindre les flammes.",
            "isCorrect": true,
            "comment": "Effectivement, en présence d'une victime dont les vêtements sont en feu, il est important d'allonger la victime sur le sol et d'éteindre les flammes avec un extincteur approprié si disponible, sinon d'utiliser une couverture ou un manteau pour éteindre les flammes."
        },
        {
            "text": "Demander aux témoins de verser du sable sur la victime pour éteindre les flammes.",
            "isCorrect": false,
            "comment": "Demander aux témoins de verser du sable sur la victime peut retarder les secours et aggraver les blessures en cas d'incendie."
        }
    ]
},
{
    "text": "Que doit faire un intervenant pour se protéger lors d'une fuite de substances dangereuses ?",
    "answers": [
        
        {
            "text": "Pénétrer dans la zone contaminée pour évaluer l'ampleur de la fuite et arrêter la source du déversement.",
            "isCorrect": false,
            "comment": "Pénétrer dans la zone contaminée peut mettre l'intervenant en danger et aggraver la situation en cas de fuite de substances dangereuses."
        },
{
            "text": "Rester à distance de la fuite, écarter les témoins de la scène, ne pas provoquer d'étincelles, et alerter immédiatement les sapeurs-pompiers.",
            "isCorrect": true,
            "comment": "Effectivement, lors d'une fuite de substances dangereuses, il est essentiel de rester à distance de la fuite, d'écarter les témoins de la scène, de ne pas provoquer d'étincelles, et d'alerter immédiatement les sapeurs-pompiers pour obtenir une assistance spécialisée."
        },
        {
            "text": "Éteindre les flammes si la fuite de substances dangereuses est accompagnée d'un incendie.",
            "isCorrect": false,
            "comment": "Éteindre les flammes peut être dangereux si la fuite de substances dangereuses est inflammable et augmenter le risque d'explosion."
        },
        {
            "text": "Attendre que les secours arrivent sur place avant d'intervenir.",
            "isCorrect": false,
            "comment": "Attendre que les secours arrivent sur place peut retarder la prise de mesures d'urgence et aggraver les conséquences de la fuite de substances dangereuses."
        }
    ]
},
{
    text: "Combien de techniques de dégagement d'urgence sont décrites pour soustraire une victime à un danger réel et vital ?",
    answers: [
        {
            text: "Trois",
            isCorrect: true,
            comment: "Effectivement, trois techniques de dégagement d'urgence sont décrites pour soustraire une victime à un danger réel et vital : traction par les chevilles, traction par les poignets, et traction par les vêtements."
        },
        {
            text: "Cinq",
            isCorrect: false,
            comment: "Il y a en réalité trois techniques de dégagement d'urgence décrites pour soustraire une victime à un danger réel et vital."
        },
        {
            text: "Quatre",
            isCorrect: false,
            comment: "Il y a en réalité trois techniques de dégagement d'urgence décrites pour soustraire une victime à un danger réel et vital."
        },
        {
            text: "Deux",
            isCorrect: false,
            comment: "Il y a en réalité trois techniques de dégagement d'urgence décrites pour soustraire une victime à un danger réel et vital."
        }
    ]
},
{
    text: "Quelle est la principale justification du dégagement d'urgence d'une victime ?",
    answers: [
        {
            text: "Assurer la sécurité des secouristes.",
            isCorrect: false,
            comment: "Assurer la sécurité des secouristes est un objectif important mais ce n'est pas la principale justification du dégagement d'urgence."
        },
        {
            text: "Permettre de réaliser en toute sécurité le bilan et les gestes de secours d'urgence sur la victime.",
            isCorrect: true,
            comment: "Effectivement, la principale justification du dégagement d'urgence est de permettre de déplacer rapidement la victime vers un lieu sûr où les gestes de secours peuvent être réalisés en toute sécurité."
        },
        {
            text: "Éviter tout risque de suraccident.",
            isCorrect: false,
            comment: "Éviter tout risque de suraccident est un objectif du dégagement d'urgence mais ce n'est pas sa principale justification."
        },
        {
            text: "S'assurer que la victime n'est pas en contact avec des objets tranchants.",
            isCorrect: false,
            comment: "S'assurer que la victime n'est pas en contact avec des objets tranchants est une mesure importante mais ce n'est pas la principale justification du dégagement d'urgence."
        }
    ]
},
{
    text: "Quelles sont les actions à entreprendre lors du dégagement d'urgence d'une victime en traction par les poignets ?",
    answers: [
        {
            text: "Saisir la victime par les poignets et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
            isCorrect: true,
            comment: "Effectivement, lors du dégagement d'urgence d'une victime en traction par les poignets, l'intervenant doit saisir la victime par les poignets et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr."
        },
        {
            text: "Saisir la victime par les chevilles et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
            isCorrect: false,
            comment: "Saisir la victime par les chevilles correspond à une autre technique de dégagement d'urgence, pas à la traction par les poignets."
        },
        {
            text: "Saisir la victime par les vêtements et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
            isCorrect: false,
            comment: "Saisir la victime par les vêtements correspond à une autre technique de dégagement d'urgence, pas à la traction par les poignets."
        },
        {
            text: "Saisir la victime par ses chevilles et poignets et la tirer sur le sol jusqu'à ce qu'elle soit en lieu sûr.",
            isCorrect: false,
            comment: "Saisir la victime par ses chevilles et poignets correspondrait à une combinaison des deux techniques, mais en traction par les poignets, seuls les poignets sont saisis."
        }
    ]
},
{
    text: "Quelle est la méthode appropriée pour dégager une victime d'un véhicule lors d'un dégagement d'urgence ?",
    answers: [
        {
            text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les chevilles.",
            isCorrect: false,
            comment: "Saisir la victime par les chevilles correspondaient à une autre technique de dégagement d'urgence, pas au dégagement d'un véhicule."
        },
        {
            text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les poignets.",
            isCorrect: false,
            comment: "Saisir la victime par les poignets correspondrait à une autre technique de dégagement d'urgence, pas au dégagement d'un véhicule."
        },
        {
            text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les vêtements.",
            isCorrect: false,
            comment: "Saisir la victime par les vêtements correspondaient à une autre technique de dégagement d'urgence, pas au dégagement d'un véhicule."
        },
        {
            text: "Détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les aisselles.",
            isCorrect: true,
            comment: "Effectivement, la méthode appropriée pour dégager une victime d'un véhicule lors d'un dégagement d'urgence est de détacher la ceinture de sécurité, dégager les pieds de la victime des pédales, et tirer la victime hors du véhicule en la saisissant par les aisselles."
        }
    ]
},
{
    text: "Quelle est la méthode recommandée pour dégager un enfant ou un nourrisson lors d'un dégagement d'urgence ?",
    answers: [
        {
            text: "Saisir l'enfant ou le nourrisson par les vêtements et le tirer sur le sol jusqu'à ce qu'il soit en lieu sûr.",
            isCorrect: false,
            comment: "Saisir l'enfant ou le nourrisson par les vêtements correspond à une technique de dégagement d'urgence pour les adultes, pas pour les enfants ou les nourrissons."
        },
        {
            text: "Utiliser une pince de désincarcération pour dégager l'enfant ou le nourrisson du véhicule.",
            isCorrect: false,
            comment: "Utiliser une pince de désincarcération est une méthode inappropriée pour dégager un enfant ou un nourrisson, car cela pourrait causer des blessures."
        },
        {
            text: "Dégager l'enfant ou le nourrisson en le portant dans les bras.",
            isCorrect: true,
            comment: "Effectivement, la méthode recommandée pour dégager un enfant ou un nourrisson lors d'un dégagement d'urgence est de le porter dans les bras pour le mettre en lieu sûr."
        },
        {
            text: "Tirer l'enfant ou le nourrisson par les chevilles jusqu'à ce qu'il soit en lieu sûr.",
            isCorrect: false,
            comment: "Tirer l'enfant ou le nourrisson par les chevilles peut être dangereux et aggraver ses blessures lors d'un dégagement d'urgence."
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
