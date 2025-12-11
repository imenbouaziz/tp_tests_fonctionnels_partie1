Feature: Gestion des produits

Scenario: Afficher tous les produits globalement
  Given un utilisateur existe avec l'email "opp@gmail.com"
  And je suis connecté avec l'email "opp@gmail.com" et le mot de passe "1235"
  And plusieurs produits existent dans Firebase
  When j'appelle GET "/products/global"
  Then la réponse doit avoir un code 200
  And la réponse doit contenir une liste de produits

