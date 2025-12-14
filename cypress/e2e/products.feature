Feature: Gestion des utilisateurs et produits

  # ========================================
  # GESTION DES UTILISATEURS
  # ========================================

  Scenario: Création réussie d'un utilisateur
    Given un payload valide contenant un id, un nom, un âge, un email et un mot de passe
    When j'appelle l'endpoint POST /users/register avec ce payload
    Then la réponse doit avoir un code 200
    And l'utilisateur doit être enregistré dans Firebase

  Scenario: Échec de création - email déjà utilisé
    Given un utilisateur existant avec l'email "test@mail.com"
    When j'appelle POST /users/register avec un payload contenant le même email
    Then la réponse doit avoir un code 409
    And le message d'erreur doit indiquer que l'email est déjà utilisé

  # ========================================
  # CONSULTATION DES PRODUITS
  # ========================================

  Scenario: Afficher tous les produits globalement
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And plusieurs produits existent dans Firebase
    When j'appelle GET "/products/global"
    Then la réponse doit avoir un code 200
    And la réponse doit contenir une liste de produits

  Scenario: Récupérer un produit existant par ID
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And un produit avec l'id 101 existe dans Firebase
    When j'appelle GET "/products/101"
    Then la réponse doit avoir un code 200
    And la réponse doit contenir les informations du produit

  Scenario: Échec - produit introuvable par ID
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And aucun produit avec l'id 999 n'existe
    When j'appelle GET "/products/999"
    Then la réponse doit avoir un code 404

  # ========================================
  # AJOUT DE PRODUITS
  # ========================================

  Scenario: Ajouter un produit avec succès
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And un payload valide contenant un id, un nom, un prix et une date d'expiration
    When j'appelle POST "/products" avec ce payload
    Then la réponse doit avoir un code 200
    And le produit doit être enregistré dans Firebase

  Scenario: Échec - ID produit déjà existant
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And un produit avec l'id 101 existe déjà
    When j'appelle POST "/products" avec un payload contenant le même id
    Then la réponse doit avoir un code 409

  # ========================================
  # SUPPRESSION DE PRODUITS
  # ========================================

  Scenario: Supprimer un produit existant
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And un produit avec l'id 101 existe dans Firebase
    When j'appelle DELETE "/products/101"
    Then la réponse doit avoir un code 200
    And le produit doit être supprimé de Firebase

  Scenario: Échec - suppression d'un produit inexistant
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And aucun produit avec l'id 999 n'existe
    When j'appelle DELETE "/products/999"
    Then la réponse doit avoir un code 404

  # ========================================
  # MISE À JOUR DE PRODUITS
  # ========================================

  Scenario: Mettre à jour un produit existant
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And un produit avec l'id 101 existe dans Firebase
    And un payload valide contenant les nouvelles valeurs
    When j'appelle PUT "/products/101" avec ce payload
    Then la réponse doit avoir un code 200
    And les informations du produit doivent être mises à jour dans Firebase

  Scenario: Échec - mise à jour d'un produit inexistant
    Given un utilisateur existe avec l'email "opp@gmail.com"
    And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
    And aucun produit avec l'id 999 n'existe
    When j'appelle PUT "/products/999" avec un payload valide
    Then la réponse doit avoir un code 404