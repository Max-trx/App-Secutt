<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    // Adresse e-mail pré-définie où envoyer le message
    $to = "secutt@utt.fr";

    // Sujet de l'e-mail
    $subject = "Nouveau message de votre application web";

    // Corps de l'e-mail
    $body = "Nom: $name\nEmail: $email\n\n$message";
    
    // En-têtes de l'e-mail
    $headers = "From: $name <$email>";

    // Envoi de l'e-mail
    if (mail($to, $subject, $body, $headers)) {
        // Redirection après envoi du message (vous pouvez personnaliser l'URL de redirection)
        header('Location: merci.html');
    } else {
        // En cas d'échec de l'envoi, affiche un message d'erreur
        echo "Erreur lors de l'envoi du message. Veuillez réessayer.";
    }
}
?>
