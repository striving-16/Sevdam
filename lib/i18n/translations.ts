export type Locale = 'en' | 'fr' | 'ar'

export type Translations = {
  common: {
    addToBag: string
    soldOut: string
    bestseller: string
    viewAll: string
    shopNow: string
    onlyLeft: string
    loading: string
    free: string
    items: string
    item: string
  }
  nav: {
    tagline: string
    home: string
    shop: string
    skincare: string
    koreanBeauty: string
    treatments: string
    hairCare: string
    cosmetics: string
    brands: string
    deals: string
    newArrivals: string
    bestSellers: string
    trackOrder: string
    contact: string
    viewBag: string
    account: string
    search: string
    menu: string
    close: string
    categories: string
    signIn: string
  }
  hero: {
    eyebrow: string
    line1: string
    line2: string
    line3: string
    italic: string
    sub: string
    shopNow: string
    secondaryCta: string
    whatsappCta: string
    exploreCta: string
    stat1Val: string
    stat1Label: string
    stat2Val: string
    stat2Label: string
    stat3Val: string
    stat3Label: string
    floatingProduct: string
    floatingBadge: string
  }
  bestSellers: {
    eyebrow: string
    title: string
    sub: string
    orderWhatsApp: string
    viewAll: string
  }
  trustBar: {
    authenticTitle: string
    authenticSub: string
    cleanTitle: string
    cleanSub: string
    dermTitle: string
    dermSub: string
    returnsTitle: string
    returnsSub: string
    shippingTitle: string
    expertsTitle: string
  }
  categories: {
    title: string
    skincare: string
    skincareDesc: string
    korean: string
    koreanDesc: string
    treatment: string
    treatmentDesc: string
    hair: string
    hairDesc: string
    cosmetics: string
    cosmeticsDesc: string
  }
  featured: {
    eyebrow: string
    title: string
    viewAll: string
  }
  routine: {
    eyebrow: string
    title: string
    italic: string
    viewAll: string
    step1: string
    step1Tag: string
    step1Desc: string
    step2: string
    step2Tag: string
    step2Desc: string
    step3: string
    step3Tag: string
    step3Desc: string
  }
  testimonials: {
    eyebrow: string
    title: string
    aggregate: string
    verifiedBuyer: string
    r1Name: string
    r1Skin: string
    r1Text: string
    r1Product: string
    r2Name: string
    r2Skin: string
    r2Text: string
    r2Product: string
    r3Name: string
    r3Skin: string
    r3Text: string
    r3Product: string
  }
  brand: {
    eyebrow: string
    line1: string
    line2: string
    italic: string
    sub: string
    cta: string
    s1Val: string
    s1Label: string
    s2Val: string
    s2Label: string
    s3Val: string
    s3Label: string
    s4Val: string
    s4Label: string
  }
  products: {
    eyebrow: string
    title: string
    searchPlaceholder: string
    noResults: string
    noResultsFor: string
    results: string
    resultSingular: string
    allCategories: string
    filterBy: string
  }
  productDetail: {
    benefitsTab: string
    ingredientsTab: string
    usageTab: string
    addToBag: string
    soldOut: string
    qty: string
    sku: string
    relatedTitle: string
    onlyLeft: string
    outOfStock: string
  }
  cart: {
    eyebrow: string
    title: string
    empty: string
    emptyDesc: string
    browseCta: string
    remove: string
    subtotal: string
    delivery: string
    deliverySub: string
    total: string
    checkout: string
    continueShopping: string
  }
  checkout: {
    eyebrow: string
    title: string
    contactSection: string
    nameLabel: string
    namePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    addressLabel: string
    addressPlaceholder: string
    summaryTitle: string
    qty: string
    placeOrder: string
    placing: string
  }
  orderConfirmation: {
    title: string
    sub: string
    orderIdLabel: string
    statusLabel: string
    deliveryLabel: string
    itemsLabel: string
    totalLabel: string
    continueShopping: string
    goHome: string
  }
  footer: {
    tagline: string
    shopTitle: string
    infoTitle: string
    copyright: string
    sub: string
    skincare: string
    perfumes: string
    makeup: string
    hair: string
    about: string
    contact: string
    track: string
    returns: string
  }
}

const en: Translations = {
  common: {
    addToBag: 'Add to Bag',
    soldOut: 'Sold Out',
    bestseller: 'Bestseller',
    viewAll: 'View all',
    shopNow: 'Shop Now',
    onlyLeft: 'Only {n} left',
    loading: 'Loading…',
    free: 'Free',
    items: 'items',
    item: 'item',
  },
  nav: {
    tagline: 'Beauty & Skincare',
    home: 'Home',
    shop: 'Shop',
    skincare: 'Skincare',
    koreanBeauty: 'Korean Beauty',
    treatments: 'Treatments',
    hairCare: 'Hair Care',
    cosmetics: 'Cosmetics',
    brands: 'Brands',
    deals: 'Deals',
    newArrivals: 'New Arrivals',
    bestSellers: 'Best Sellers',
    trackOrder: 'Track Order',
    contact: 'Contact',
    viewBag: 'View Bag',
    account: 'Account',
    search: 'Search',
    menu: 'Menu',
    close: 'Close',
    categories: 'Categories',
    signIn: 'Sign in',
  },
  hero: {
    eyebrow: 'Dreamshop · Authentic Beauty',
    line1: 'Beauty you love,',
    line2: 'prices',
    line3: "you'll love more.",
    italic: 'prices',
    sub: "We source the best beauty brands worldwide and bring them to you at unbeatable prices. 100% authentic, always in stock, and always just a WhatsApp message away.",
    shopNow: 'Shop Now',
    secondaryCta: 'Explore Products',
    whatsappCta: 'Order on WhatsApp',
    exploreCta: 'Explore Products',
    stat1Val: '10,000+',
    stat1Label: 'Happy Clients',
    stat2Val: '4.9★',
    stat2Label: 'Average Rating',
    stat3Val: '100%',
    stat3Label: 'Authentic Products',
    floatingProduct: 'Glow Serum — Niacinamide 10%',
    floatingBadge: '✓ Lowest Price Guaranteed',
  },
  bestSellers: {
    eyebrow: 'Most Loved',
    title: 'Best Sellers',
    sub: 'The products our customers keep coming back for',
    orderWhatsApp: 'Order on WhatsApp',
    viewAll: 'View All Products',
  },
  trustBar: {
    authenticTitle: '100% Authentic Products',
    authenticSub: 'Sourced directly from brands',
    cleanTitle: 'Lowest Prices Guaranteed',
    cleanSub: 'No harmful ingredients',
    dermTitle: 'Fast WhatsApp Support',
    dermSub: 'Safe for all skin types',
    returnsTitle: 'Easy 30-Day Returns',
    returnsSub: '30-day no-hassle policy',
    shippingTitle: 'Free Delivery on $50+',
    expertsTitle: 'Trusted by 10,000+ Clients',
  },
  categories: {
    title: 'Shop by Category',
    skincare: 'Skincare',
    skincareDesc: 'Serums, moisturizers & more',
    korean: 'Korean Beauty',
    koreanDesc: 'K-beauty essentials',
    treatment: 'Treatments',
    treatmentDesc: 'Targeted skin solutions',
    hair: 'Hair Care',
    hairDesc: 'Scalp to tip rituals',
    cosmetics: 'Cosmetics',
    cosmeticsDesc: 'Clean colour & finish',
  },
  featured: {
    eyebrow: 'Community Favourites',
    title: 'Best Sellers',
    viewAll: 'View all',
  },
  routine: {
    eyebrow: 'Build Your Ritual',
    title: 'The 3-step',
    italic: 'glow routine',
    viewAll: 'Shop all products',
    step1: 'Cleanse',
    step1Tag: 'Morning & Evening',
    step1Desc: 'Remove impurities without stripping your skin barrier.',
    step2: 'Treat',
    step2Tag: 'After cleansing',
    step2Desc: 'Targeted serums for your specific skin concerns.',
    step3: 'Moisturize',
    step3Tag: 'Final step',
    step3Desc: 'Lock in hydration and protect your skin barrier.',
  },
  testimonials: {
    eyebrow: 'Real Results',
    title: 'What our customers say',
    aggregate: '4.9 out of 5 — based on 2,400+ reviews',
    verifiedBuyer: 'Verified buyer',
    r1Name: 'Sarah M.',
    r1Skin: 'Oily, acne-prone',
    r1Text: 'The niacinamide serum completely transformed my skin. My pores look smaller and breakouts have reduced by at least 70% in just 3 weeks.',
    r1Product: 'Glow Serum — Niacinamide 10%',
    r2Name: 'Lina K.',
    r2Skin: 'Dry, sensitive',
    r2Text: "I've tried so many moisturizers but this one is the first that doesn't make my skin react. It's incredibly lightweight yet deeply hydrating.",
    r2Product: 'Ceramide Barrier Cream',
    r3Name: 'Amara T.',
    r3Skin: 'Combination',
    r3Text: 'The Korean skincare routine kit changed everything. My friends keep asking what I\'ve done differently — it\'s just this routine!',
    r3Product: 'K-Beauty Starter Kit',
  },
  brand: {
    eyebrow: 'Our Philosophy',
    line1: 'Skincare rooted in',
    line2: 'powered by nature.',
    italic: 'science,',
    sub: "Every product we carry is selected for efficacy first. No filler ingredients. No greenwashing. Just formulas that have been proven to deliver real, visible results.",
    cta: 'Discover the collection',
    s1Val: '200+', s1Label: 'Curated Products',
    s2Val: '50+', s2Label: 'Korean Brands',
    s3Val: '4.9★', s3Label: 'Customer Rating',
    s4Val: '100%', s4Label: 'Clean Formulas',
  },
  products: {
    eyebrow: 'Collection',
    title: 'All Products',
    searchPlaceholder: 'Search serums, moisturizers…',
    noResults: 'No products found.',
    noResultsFor: 'results for',
    results: 'results',
    resultSingular: 'result',
    allCategories: 'All',
    filterBy: 'Filter',
  },
  productDetail: {
    benefitsTab: 'Benefits',
    ingredientsTab: 'Ingredients',
    usageTab: 'How to Use',
    addToBag: 'Add to Bag',
    soldOut: 'Sold Out',
    qty: 'Qty',
    sku: 'SKU',
    relatedTitle: 'You might also like',
    onlyLeft: 'Only {n} left',
    outOfStock: 'Out of stock',
  },
  cart: {
    eyebrow: 'Your Bag',
    title: 'Review your order',
    empty: 'Your bag is empty',
    emptyDesc: 'Browse our collection and add something beautiful.',
    browseCta: 'Browse products',
    remove: 'Remove',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    deliverySub: 'Calculated at checkout',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
  },
  checkout: {
    eyebrow: 'Checkout',
    title: 'Complete your order',
    contactSection: 'Contact Information',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your full name',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+1 (555) 000-0000',
    addressLabel: 'Delivery Address',
    addressPlaceholder: 'Full delivery address',
    summaryTitle: 'Order Summary',
    qty: 'Qty',
    placeOrder: 'Place Order',
    placing: 'Placing Order…',
  },
  orderConfirmation: {
    title: 'Order placed',
    sub: "Thank you, {name}. We'll be in touch soon.",
    orderIdLabel: 'Order ID',
    statusLabel: 'Status',
    deliveryLabel: 'Delivery to',
    itemsLabel: 'Items',
    totalLabel: 'Total',
    continueShopping: 'Continue shopping',
    goHome: 'Go home',
  },
  footer: {
    tagline: 'Your destination for authentic beauty brands at the lowest prices. Fast delivery, real support, always just a WhatsApp away.',
    shopTitle: 'Shop',
    infoTitle: 'Info',
    copyright: '© {year} Dreamshop. All rights reserved.',
    sub: 'Authentic Beauty — Best Prices',
    skincare: 'Skincare',
    perfumes: 'Perfumes',
    makeup: 'Makeup',
    hair: 'Hair Care',
    about: 'About Us',
    contact: 'Contact',
    track: 'Track Order',
    returns: 'Returns',
  },
}

const fr: Translations = {
  common: {
    addToBag: 'Ajouter au panier',
    soldOut: 'Épuisé',
    bestseller: 'Meilleures ventes',
    viewAll: 'Voir tout',
    shopNow: 'Acheter',
    onlyLeft: 'Plus que {n}',
    loading: 'Chargement…',
    free: 'Gratuit',
    items: 'articles',
    item: 'article',
  },
  nav: {
    tagline: 'Beauté & Soins',
    home: 'Accueil',
    shop: 'Boutique',
    skincare: 'Soins de la peau',
    koreanBeauty: 'Beauté coréenne',
    treatments: 'Soins ciblés',
    hairCare: 'Soins capillaires',
    cosmetics: 'Cosmétiques',
    brands: 'Marques',
    deals: 'Promotions',
    newArrivals: 'Nouveautés',
    bestSellers: 'Meilleures ventes',
    trackOrder: 'Suivi commande',
    contact: 'Contact',
    viewBag: 'Voir le panier',
    account: 'Compte',
    search: 'Rechercher',
    menu: 'Menu',
    close: 'Fermer',
    categories: 'Catégories',
    signIn: 'Se connecter',
  },
  hero: {
    eyebrow: 'Dreamshop · Beauté Authentique',
    line1: 'La beauté que vous aimez,',
    line2: 'aux prix',
    line3: "que vous allez adorer.",
    italic: 'prix',
    sub: "Nous sélectionnons les meilleures marques beauté au monde et vous les proposons aux meilleurs prix garantis. 100% authentique, toujours disponible, et à portée de WhatsApp.",
    shopNow: 'Acheter maintenant',
    secondaryCta: 'Explorer les produits',
    whatsappCta: 'Commander sur WhatsApp',
    exploreCta: 'Explorer les produits',
    stat1Val: '10 000+',
    stat1Label: 'Clients satisfaits',
    stat2Val: '4,9★',
    stat2Label: 'Note moyenne',
    stat3Val: '100%',
    stat3Label: 'Produits authentiques',
    floatingProduct: 'Sérum Éclat — Niacinamide 10%',
    floatingBadge: '✓ Prix le plus bas garanti',
  },
  bestSellers: {
    eyebrow: 'Les Plus Aimés',
    title: 'Meilleures Ventes',
    sub: 'Les produits que nos clients commandent encore et encore',
    orderWhatsApp: 'Commander sur WhatsApp',
    viewAll: 'Voir tous les produits',
  },
  trustBar: {
    authenticTitle: '100% Produits Authentiques',
    authenticSub: 'Sourcé directement des marques',
    cleanTitle: 'Prix les plus bas garantis',
    cleanSub: 'Sans ingrédients nocifs',
    dermTitle: 'Support WhatsApp Rapide',
    dermSub: 'Sûr pour tous les types de peau',
    returnsTitle: 'Retours faciles 30 jours',
    returnsSub: 'Politique sans tracas 30 jours',
    shippingTitle: 'Livraison gratuite dès 50€',
    expertsTitle: 'Approuvé par 10 000+ clients',
  },
  categories: {
    title: 'Acheter par catégorie',
    skincare: 'Soins de la peau',
    skincareDesc: 'Sérums, crèmes & plus',
    korean: 'Beauté coréenne',
    koreanDesc: 'Essentiels K-beauty',
    treatment: 'Soins ciblés',
    treatmentDesc: 'Solutions pour la peau',
    hair: 'Soins capillaires',
    hairDesc: 'Du cuir chevelu aux pointes',
    cosmetics: 'Cosmétiques',
    cosmeticsDesc: 'Couleur & finition propres',
  },
  featured: {
    eyebrow: 'Favoris de la communauté',
    title: 'Meilleures ventes',
    viewAll: 'Voir tout',
  },
  routine: {
    eyebrow: 'Créez votre rituel',
    title: 'La routine en',
    italic: '3 étapes éclat',
    viewAll: 'Voir tous les produits',
    step1: 'Nettoyer',
    step1Tag: 'Matin & Soir',
    step1Desc: 'Éliminez les impuretés sans altérer votre barrière cutanée.',
    step2: 'Traiter',
    step2Tag: 'Après le nettoyage',
    step2Desc: 'Sérums ciblés pour vos problèmes de peau spécifiques.',
    step3: 'Hydrater',
    step3Tag: 'Dernière étape',
    step3Desc: 'Sceller l\'hydratation et protéger votre barrière cutanée.',
  },
  testimonials: {
    eyebrow: 'Résultats réels',
    title: 'Ce que disent nos clients',
    aggregate: '4,9 sur 5 — basé sur 2 400+ avis',
    verifiedBuyer: 'Acheteur vérifié',
    r1Name: 'Sarah M.',
    r1Skin: 'Peau grasse, acnéique',
    r1Text: 'Le sérum à la niacinamide a complètement transformé ma peau. Mes pores semblent plus petits et les imperfections ont diminué de 70% en 3 semaines.',
    r1Product: 'Sérum Éclat — Niacinamide 10%',
    r2Name: 'Lina K.',
    r2Skin: 'Peau sèche, sensible',
    r2Text: "J'ai essayé tant de crèmes mais celle-ci est la première qui ne fait pas réagir ma peau. Incroyablement légère mais profondément hydratante.",
    r2Product: 'Crème Barrière Céramide',
    r3Name: 'Amara T.',
    r3Skin: 'Peau mixte',
    r3Text: "La routine K-beauty a tout changé. Mes amies me demandent sans cesse ce que j'ai fait — c'est juste cette routine !",
    r3Product: 'Kit Débutante K-Beauty',
  },
  brand: {
    eyebrow: 'Notre philosophie',
    line1: 'Soins ancrés dans la',
    line2: 'propulsés par la nature.',
    italic: 'science,',
    sub: "Chaque produit est sélectionné pour son efficacité. Pas d'ingrédients de remplissage. Pas de greenwashing. Des formules qui ont prouvé leur efficacité.",
    cta: 'Découvrir la collection',
    s1Val: '200+', s1Label: 'Produits sélectionnés',
    s2Val: '50+', s2Label: 'Marques coréennes',
    s3Val: '4,9★', s3Label: 'Note clients',
    s4Val: '100%', s4Label: 'Formules propres',
  },
  products: {
    eyebrow: 'Collection',
    title: 'Tous les produits',
    searchPlaceholder: 'Rechercher sérums, crèmes…',
    noResults: 'Aucun produit trouvé.',
    noResultsFor: 'résultats pour',
    results: 'résultats',
    resultSingular: 'résultat',
    allCategories: 'Tous',
    filterBy: 'Filtrer',
  },
  productDetail: {
    benefitsTab: 'Bienfaits',
    ingredientsTab: 'Ingrédients',
    usageTab: 'Mode d\'emploi',
    addToBag: 'Ajouter au panier',
    soldOut: 'Épuisé',
    qty: 'Qté',
    sku: 'Réf.',
    relatedTitle: 'Vous pourriez aussi aimer',
    onlyLeft: 'Plus que {n}',
    outOfStock: 'En rupture de stock',
  },
  cart: {
    eyebrow: 'Votre panier',
    title: 'Vérifiez votre commande',
    empty: 'Votre panier est vide',
    emptyDesc: 'Parcourez notre collection et ajoutez quelque chose de beau.',
    browseCta: 'Parcourir les produits',
    remove: 'Supprimer',
    subtotal: 'Sous-total',
    delivery: 'Livraison',
    deliverySub: 'Calculée à la commande',
    total: 'Total',
    checkout: 'Passer à la caisse',
    continueShopping: 'Continuer mes achats',
  },
  checkout: {
    eyebrow: 'Commande',
    title: 'Finaliser votre commande',
    contactSection: 'Informations de contact',
    nameLabel: 'Nom complet',
    namePlaceholder: 'Votre nom complet',
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '+33 6 00 00 00 00',
    addressLabel: 'Adresse de livraison',
    addressPlaceholder: 'Adresse de livraison complète',
    summaryTitle: 'Récapitulatif',
    qty: 'Qté',
    placeOrder: 'Confirmer la commande',
    placing: 'Confirmation…',
  },
  orderConfirmation: {
    title: 'Commande passée',
    sub: 'Merci, {name}. Nous vous contacterons bientôt.',
    orderIdLabel: 'N° de commande',
    statusLabel: 'Statut',
    deliveryLabel: 'Livraison à',
    itemsLabel: 'Articles',
    totalLabel: 'Total',
    continueShopping: 'Continuer mes achats',
    goHome: 'Accueil',
  },
  footer: {
    tagline: 'Votre destination pour les meilleures marques beauté aux meilleurs prix. Livraison rapide, support réel, toujours à portée de WhatsApp.',
    shopTitle: 'Boutique',
    infoTitle: 'Infos',
    copyright: '© {year} Dreamshop. Tous droits réservés.',
    sub: 'Beauté Authentique — Meilleurs Prix',
    skincare: 'Soins de la peau',
    perfumes: 'Parfums',
    makeup: 'Maquillage',
    hair: 'Soins capillaires',
    about: 'À propos',
    contact: 'Contact',
    track: 'Suivre ma commande',
    returns: 'Retours',
  },
}

const ar: Translations = {
  common: {
    addToBag: 'أضف إلى الحقيبة',
    soldOut: 'نفد المخزون',
    bestseller: 'الأكثر مبيعاً',
    viewAll: 'عرض الكل',
    shopNow: 'تسوق الآن',
    onlyLeft: 'بقي {n} فقط',
    loading: 'جارٍ التحميل…',
    free: 'مجاناً',
    items: 'منتجات',
    item: 'منتج',
  },
  nav: {
    tagline: 'الجمال والعناية بالبشرة',
    home: 'الرئيسية',
    shop: 'المتجر',
    skincare: 'العناية بالبشرة',
    koreanBeauty: 'الجمال الكوري',
    treatments: 'العلاجات',
    hairCare: 'العناية بالشعر',
    cosmetics: 'مستحضرات التجميل',
    brands: 'العلامات',
    deals: 'العروض',
    newArrivals: 'الجديد',
    bestSellers: 'الأكثر مبيعاً',
    trackOrder: 'تتبع الطلب',
    contact: 'اتصل بنا',
    viewBag: 'عرض الحقيبة',
    account: 'الحساب',
    search: 'بحث',
    menu: 'القائمة',
    close: 'إغلاق',
    categories: 'التصنيفات',
    signIn: 'تسجيل الدخول',
  },
  hero: {
    eyebrow: 'دريم شوب · جمال أصيل',
    line1: 'الجمال الذي تحبينه،',
    line2: 'بأسعار',
    line3: 'ستعشقينها أكثر.',
    italic: 'أسعار',
    sub: 'نجلب لك أفضل ماركات الجمال العالمية بأسعار لا تُنافَس — منتجات أصلية 100%، دائمة التوفر، وعلى بُعد رسالة واتساب.',
    shopNow: 'تسوق الآن',
    secondaryCta: 'تصفح المنتجات',
    whatsappCta: 'اطلب عبر واتساب',
    exploreCta: 'تصفح المنتجات',
    stat1Val: '+10,000',
    stat1Label: 'عميل سعيد',
    stat2Val: '4.9★',
    stat2Label: 'متوسط التقييم',
    stat3Val: '100%',
    stat3Label: 'منتجات أصلية',
    floatingProduct: 'سيروم التألق — نياسيناميد 10%',
    floatingBadge: '✓ أقل سعر مضمون',
  },
  bestSellers: {
    eyebrow: 'الأكثر طلباً',
    title: 'الأكثر مبيعاً',
    sub: 'المنتجات التي يعود إليها عملاؤنا دائماً',
    orderWhatsApp: 'اطلب عبر واتساب',
    viewAll: 'عرض جميع المنتجات',
  },
  trustBar: {
    authenticTitle: 'منتجات أصلية 100%',
    authenticSub: 'مصادر مباشرة من العلامات التجارية',
    cleanTitle: 'أقل الأسعار مضمونة',
    cleanSub: 'خالية من المكونات الضارة',
    dermTitle: 'دعم سريع عبر واتساب',
    dermSub: 'آمن لجميع أنواع البشرة',
    returnsTitle: 'إرجاع سهل خلال 30 يوماً',
    returnsSub: 'سياسة إرجاع 30 يوماً',
    shippingTitle: 'توصيل مجاني فوق 50$',
    expertsTitle: 'ثقة أكثر من 10,000 عميل',
  },
  categories: {
    title: 'تسوق حسب الفئة',
    skincare: 'العناية بالبشرة',
    skincareDesc: 'سيروم، مرطبات والمزيد',
    korean: 'الجمال الكوري',
    koreanDesc: 'أساسيات K-beauty',
    treatment: 'العلاجات',
    treatmentDesc: 'حلول مستهدفة للبشرة',
    hair: 'العناية بالشعر',
    hairDesc: 'طقوس من الجذر إلى الطرف',
    cosmetics: 'مستحضرات التجميل',
    cosmeticsDesc: 'ألوان نظيفة وإشراقة',
  },
  featured: {
    eyebrow: 'المفضلة لدى مجتمعنا',
    title: 'الأكثر مبيعاً',
    viewAll: 'عرض الكل',
  },
  routine: {
    eyebrow: 'ابني روتينك الجمالي',
    title: 'روتين التألق',
    italic: 'بثلاث خطوات',
    viewAll: 'تسوق جميع المنتجات',
    step1: 'التنظيف',
    step1Tag: 'صباحاً ومساءً',
    step1Desc: 'أزيلي الشوائب دون الإضرار بحاجز البشرة.',
    step2: 'العلاج',
    step2Tag: 'بعد التنظيف',
    step2Desc: 'سيروم مُستهدف لمشاكل بشرتك المحددة.',
    step3: 'الترطيب',
    step3Tag: 'الخطوة الأخيرة',
    step3Desc: 'احبسي الترطيب وحافظي على حاجز بشرتك.',
  },
  testimonials: {
    eyebrow: 'نتائج حقيقية',
    title: 'ماذا تقول عميلاتنا',
    aggregate: '4.9 من 5 — بناءً على أكثر من 2,400 تقييم',
    verifiedBuyer: 'مشترية موثقة',
    r1Name: 'سارة م.',
    r1Skin: 'بشرة دهنية، عرضة للحبوب',
    r1Text: 'سيروم النياسيناميد غيّر بشرتي تماماً. مسامي باتت أصغر بكثير والحبوب قلّت بنسبة 70% في ثلاثة أسابيع فقط.',
    r1Product: 'سيروم التألق — نياسيناميد 10%',
    r2Name: 'لينا ك.',
    r2Skin: 'بشرة جافة، حساسة',
    r2Text: 'جربت الكثير من المرطبات، لكن هذا أول مرطب لا يُسبب لي أي تهيج. خفيف الملمس ومُرطب بعمق في نفس الوقت.',
    r2Product: 'كريم حاجز السيراميد',
    r3Name: 'أميرة ت.',
    r3Skin: 'بشرة مختلطة',
    r3Text: 'مجموعة روتين الجمال الكوري غيّرت كل شيء. صديقاتي يسألنني باستمرار عن سر إشراقتي — السر هو هذا الروتين فقط!',
    r3Product: 'طقم مبتدئات K-Beauty',
  },
  brand: {
    eyebrow: 'فلسفتنا',
    line1: 'عناية بالبشرة مستندة',
    line2: 'مدعومة بالطبيعة.',
    italic: 'إلى العلم،',
    sub: 'كل منتج نحمله مُختار بناءً على الفاعلية أولاً. لا مكونات حشو. لا ادعاءات زائفة. فقط تركيبات أثبتت نتائجها الفعلية.',
    cta: 'اكتشفي المجموعة',
    s1Val: '+200', s1Label: 'منتج مختار',
    s2Val: '+50', s2Label: 'علامة كورية',
    s3Val: '4.9★', s3Label: 'تقييم العملاء',
    s4Val: '100%', s4Label: 'تركيبات نظيفة',
  },
  products: {
    eyebrow: 'المجموعة',
    title: 'جميع المنتجات',
    searchPlaceholder: 'ابحث عن سيروم، مرطب…',
    noResults: 'لا توجد منتجات.',
    noResultsFor: 'نتائج لـ',
    results: 'نتائج',
    resultSingular: 'نتيجة',
    allCategories: 'الكل',
    filterBy: 'تصفية',
  },
  productDetail: {
    benefitsTab: 'الفوائد',
    ingredientsTab: 'المكونات',
    usageTab: 'طريقة الاستخدام',
    addToBag: 'أضف إلى الحقيبة',
    soldOut: 'نفد المخزون',
    qty: 'الكمية',
    sku: 'رقم المنتج',
    relatedTitle: 'قد يعجبك أيضاً',
    onlyLeft: 'بقي {n} فقط',
    outOfStock: 'غير متوفر',
  },
  cart: {
    eyebrow: 'حقيبتك',
    title: 'مراجعة طلبك',
    empty: 'حقيبتك فارغة',
    emptyDesc: 'تصفحي مجموعتنا وأضيفي شيئاً رائعاً.',
    browseCta: 'تصفح المنتجات',
    remove: 'إزالة',
    subtotal: 'المجموع الجزئي',
    delivery: 'التوصيل',
    deliverySub: 'يُحسب عند الدفع',
    total: 'المجموع الكلي',
    checkout: 'المتابعة للدفع',
    continueShopping: 'مواصلة التسوق',
  },
  checkout: {
    eyebrow: 'الدفع',
    title: 'أكملي طلبك',
    contactSection: 'معلومات التواصل',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'اسمك الكامل',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+213 555 000 000',
    addressLabel: 'عنوان التوصيل',
    addressPlaceholder: 'عنوان التوصيل الكامل',
    summaryTitle: 'ملخص الطلب',
    qty: 'الكمية',
    placeOrder: 'تأكيد الطلب',
    placing: 'جارٍ التأكيد…',
  },
  orderConfirmation: {
    title: 'تم استلام الطلب',
    sub: 'شكراً، {name}. سنتواصل معك قريباً.',
    orderIdLabel: 'رقم الطلب',
    statusLabel: 'الحالة',
    deliveryLabel: 'التوصيل إلى',
    itemsLabel: 'المنتجات',
    totalLabel: 'الإجمالي',
    continueShopping: 'مواصلة التسوق',
    goHome: 'الصفحة الرئيسية',
  },
  footer: {
    tagline: 'وجهتك للحصول على أفضل ماركات الجمال بأقل الأسعار. توصيل سريع، دعم حقيقي، دائماً على بُعد رسالة واتساب.',
    shopTitle: 'المتجر',
    infoTitle: 'معلومات',
    copyright: '© {year} Dreamshop. جميع الحقوق محفوظة.',
    sub: 'جمال أصيل — أفضل الأسعار',
    skincare: 'العناية بالبشرة',
    perfumes: 'العطور',
    makeup: 'المكياج',
    hair: 'العناية بالشعر',
    about: 'من نحن',
    contact: 'تواصل معنا',
    track: 'تتبع الطلب',
    returns: 'الإرجاع',
  },
}

export const translations: Record<Locale, Translations> = { en, fr, ar }
