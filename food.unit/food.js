// food.js

export function getfood(foodid) {
  let matchingfood;
  food.forEach((foods) => {
    if (foods.name === foodid) {
      matchingfood = foods;
    }
  });
  return matchingfood;
}

export const food = [  {
    Image:
      "foods/c.png" ,
    name: "Chicken & Fries",
    rating: {
      stars: 2.5,
      count: 56,
    },
    price: 150,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"This is a combination meal consisting of fried/grilled chicken and french fries, The fries (chips) are standard cut potatoes, almost certainly deep-fried.",
    Allergies1:"Soybean oil is one of the most widely used and cost-effective vegetable oils for deep-frying both the chicken and the fries.",
    Allergies2:"Egg is often used as a wash or binder to help the breading or seasoning adhere to the chicken pieces before frying."
  },
  {
    Image: "foods/w.png",
    name: "Wonjo Juice",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:" The Wonjo Juice is a distinct, deep crimson-red beverage made from the dried calyces (sepals) of the hibiscus flower (Hibiscus sabdariffa), also known as Roselle or Sorrel. ",
    Allergies1:"Wonjo is made from dried hibiscus flowers, water, and sugar. It does not contain any of the top 8 common allergens (milk, egg, peanut, tree nut, soy, wheat, fish, shellfish) by nature.",
    Allergies2:"While the base is safe, flavorings like mint, ginger, or added fruit essence/syrup could introduce highly minor or less common allergens depending on the additive's source."
  },{
    Image: "foods/bbb.png",
    name: "Chocolate Brownie",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 50,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"A chocolate brownie is a dense, often fudgy or chewy baked dessert square with a rich, dark cocoa flavor. ",
    Allergies1:"The primary allergens present in a chocolate brownie are Wheat (Gluten), Dairy (Milk), Egg, and potentially Tree Nuts. The Wheat (Gluten) comes from the flour, consumption of which would trigger typical allergy symptoms (hives, swelling) or Celiac disease reactions (severe digestive upset, pain). ",
    Allergies2:"Egg is a critical binding and leavening agent in the recipe, and an allergy to egg can cause symptoms like skin rashes, gastrointestinal issues, or respiratory problems."
  },


  
  {
    Image:
      "foods/pp.png",
    name: "Pasta",
    rating: {
      stars: 3.5,
      count: 99,
    },
    price: 75,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"This dish consists of cooked pasta (like spaghetti, macaroni, or penne) mixed with savory canned beef. The sauce is typically built from sautéed onions and flavored with seasonings like black pepper.",
    Allergies1:"Wheat (Gluten) comes from the pasta itself, is made from wheat semolina; consuming this would trigger typical allergy symptoms or Celiac disease reactions (severe digestive upset, abdominal pain)",
    Allergies2:"Sulphites are almost certainly present in the bouillon cubes and some processed canned foods as preservatives, which can trigger asthma symptoms (wheezing, difficulty breathing) or hives."
  },
  {
    Image: "foods/mc.jpg",
    name: "Mac & Cheese",
    rating: {
      stars: 3,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Macaroni and Cheese (Mac and Cheese) is the quintessential comfort food—a warm, creamy, and carb-heavy embrace in a bowl. At its core, it is a dish of cooked pasta (usually elbow macaroni) smothered in a rich cheese sauce."
    ,Allergies1: "Wheat (Gluten): Causes intestinal damage in Celiac patients or respiratory/skin reactions in those with wheat allergies."
    ,Allergies2:' Mustard: Can lead to rapid-onset allergic reactions, including hives, swelling, and severe breathing difficulties.'
  
  },
  {
    Image: "foods/b.png",
    name: "Boabab juice",
    rating: {
      stars: 4.5,
      count: 76,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Baobab juice, known locally as Bouye (or Bouye), is a traditional, refreshing, and creamy Gambian beverage made from the dry, powdery pulp of the large, hard-shelled baobab fruit.",
    Allergies1:" is introduced via the use of evaporated milk, condensed milk, or powdered milk to create the creamy texture; consumption by a sensitive individual will trigger typical dairy allergy symptoms like hives, itching, or digestive distress.",
    Allergies2:". Additionally, due to its exceptionally high Fiber content, overconsumption of the juice may lead to mild, temporary Gastrointestinal Distress such as bloating, gas, or diarrhea."
  },
  {
    Image: "foods/s.jpeg",
    name: "Sausages",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"This dish involves pre-cooked or raw sausages that have been coated in a layer of bread crumbs to create a crisp exterior upon frying or baking.",
    Allergies1:"Wheat (Gluten) is present in the bread crumbs (which are made from bread) and often in the sausages themselves as a filler; ingestion by a sensitive person will trigger typical allergic symptoms or chronic digestive distress (Celiac reaction). ",
    Allergies2:" Egg is highly likely to be used as the wash/binder that holds the bread crumbs to the sausage; an egg allergy can cause reactions ranging from skin irritation and hives to severe respiratory or gastrointestinal issues. "
  },

   {
    Image:
      "foods/m.jpg",
    name: "Moist Chocolate Cake",
    rating: {
      stars: 3.5,
      count: 99,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Moist chocolate cake is the 'holy grail'of baking—a rich, dark, and decadent dessert that manages to stay soft for days. Unlike a sponge cake that can be airy but dry, a truly moist chocolate cake has a 'truffle-like' crumb that almost melts in your mouth.",
    Allergies1:"Eggs: Provide the structure; hard to replace without affecting the 'bounce.'",
    Allergies2:"Soy: Often hidden in chocolate chips or vegetable oil blends (soybean oil)."
  },
  
  {
    Image:
      "foods/m.png",
    name: "Chicken & Potato Salade",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 150,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,

    }
     ,info:' A hearty and vibrant meal featuring a perfectly roasted chicken drumstick with a savory, golden-brown glaze. It’s served alongside a creamy homemade potato salad tossed with fresh herbs and a crisp coleslaw mix of shredded cabbage and carrots.',
    Allergies2: 'Eggs & Dairy	Often cause skin rashes (hives) or stomach upset.'
    ,Allergies1: 'Sulfites	Mostly causes respiratory issues, like coughing or wheezing, especially for people with asthma.'
    
  },
  {
    Image: "foods/v.jpg",
    name: "Vegetable Spring Rolls",
    rating: {
      stars: 3,
      count: 99,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Vegetable spring rolls are the ultimate crispy, golden appetizers. They offer a satisfying contrast between a shattered-glass outer crunch and a tender, savory interior."
    ,Allergies1: " Digestive Distress: Stomach cramps, nausea, vomiting, or diarrhea (common with soy or gluten intolerance)."
    ,Allergies2:' For those with a "true" allergy (especially to peanuts or sesame), the body’s immune system overreacts. This can lead to anaphylaxis, which is a medical emergency:'
  
  },

 {
    Image: "foods/ch.png",
    name: "Chicken Vermecell",
    rating: {
      stars: 3,
      count: 99,
    },
    price: 150,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Chicken Vermicelli features thin, delicate vermicelli noodles (thin pasta, often made from wheat) tossed with pieces of chicken and a rich, deeply flavored sauce. The color of the noodles is usually a deep golden-yellow."
    ,Allergies1: " A protein found in grains like wheat, barley, and rye. A major allergen causing celiac disease or wheat allergy."
    ,Allergies2:' The protein source itself, though less common than other allergens, can cause an allergy.'
  
  },
 {
    Image: "foods/vc.png",
    name: "Butter Cake",
    rating: {
      stars: 3,
      count: 99,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:" Unlike a light and airy sponge, a butter cake is sturdy yet tender. It features a fine, tight crumb structure and a golden-brown exterior. The flavor is defined by the 'Maillard reaction' (the browning of sugars and proteins)."
    ,Allergies1: " Dairy (Butter/Milk): Causes gastrointestinal upset (lactose intolerance) or life-threatening anaphylaxis (milk protein allergy)."
    ,Allergies2:' Eggs: Triggers skin hives, vomiting, or severe respiratory distress in allergic individuals.'
  
  },

  {
    Image:
      "foods/v.png",
    name: "Chicken Yasa",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,

    }
    ,info:' is one of the most popular and classic dishes in Gambian and Senegalese cuisine. Chicken Yassa, while often made with simple ingredients, contains several potential allergens that individuals should be aware of.',
    Allergies2: ' Mustard is one of the main flavor components (usually Dijon mustard) and is listed as one of the Big 9 major food allergens in some regions (like the EU and Canada).'
    ,Allergies1: 'Onions are the main bulk of the dish. While rare, some people have an intolerance or allergy to onions and garlic (foods in the allium family).'
    
  },

  
  {
    Image: "foods/p.png",
    name: "Pizza",
    rating: {
      stars: 2.5,
      count: 67,
    },
    price: 150,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info: 'Pizza is a savory Italian dish consisting of a usually rounded, flattened base of leavened wheat dough topped with a tomato-based sauce, cheese (typically mozzarella), and various other ingredients (toppings), which is then baked.'
    
    ,Allergies1: 'A common ingredient in pizza crust, a source of gluten intolerance. '
    ,Allergies2:' An ingredient in the dough, which can cause reactions in some individuals.  '
  },
  {
    Image: "foods/e.png",
    name: "Ebbeh",
    rating: {
      stars: 2.5,
      count: 29,
    },
    price: 50,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Ebbeh is a beloved, hearty, one-pot soup or stew that is one of The Gambia's most popular street foods. It is a thick, creamy dish primarily made from cassava"
    ,Allergies1: "Crabs, Shrimp (Prawns), and often Mussels or Clams are central and defining ingredients in Ebbeh, making this the highest allergen risk."
    ,Allergies2:' Smoked fish (such as Catfish, Bonga, or Mackerel) is a core component used to flavor and enrich the soup.  '
  },
  {
    Image:
      "foods/d.png",
    name: "Domoda",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Domoda is widely considered the national dish of The Gambia and is a rich, flavorful, and thick stew primarily made from groundnut paste (natural peanut butter).",
    Allergies1:"The most critical and certain allergen in Domoda is Peanuts (groundnut paste), posing a severe, often life-threatening risk of anaphylaxis (difficulty breathing, circulatory collapse) to allergic individuals. ",
    Allergies2:" Other common allergens include Soy and Sulphites found in seasoning cubes (Maggi/Knorr), which can trigger skin reactions or, for sulphite-sensitive individuals, asthma symptoms. "
  }, 
  {
    Image: "foods/ss.jpg",
    name: "Chicken shawarma",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 150,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Chicken Shawarma is a popular Middle Eastern street food where seasoned chicken is stacked in a cone-like shape on a vertical rotisserie (spit) and slow-roasted."
    ,Allergies1: " The dish is almost always served wrapped in pita bread or a similar flatbread made from wheat flour. "
    ,Allergies2:' The classic accompaniment to Shawarma is Tahini, a sauce/paste made from ground sesame seeds. It is an extremely common condiment. '
  
  },{
    Image: "foods/ss.png",
    name: "SupaKanja",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"SupaKanja (also known as Superkanja or Soupa Kanja) is a hearty, deeply savory, and characteristically viscous stew that is a staple dish in The Gambia and other parts of West Africa.",
    Allergies1:"A mixture of smoked, dried, and sometimes fresh fish  to provide its deep flavor; consumption by an allergic individual will trigger reactions ranging from mild oral symptoms to severe, life-threatening anaphylaxis.",
    Allergies2:"Another frequent major allergen is Soy, which is highly likely to be present via the common use of a seasoning cube (Maggi or Jumbo), which can trigger upset stomach"
  },
   {
    Image: "foods/mm.jpg",
    name: "Meat Pie",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 30,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"The Gambian Meat Pie is similar to a British meat pie or an Empanada/Fataya, consisting of a savory filling encased in a firm, often fried or baked, pastry crust.",
    Allergies1:"The entire pie crust is made from wheat flour (typically all-purpose flour), making it a major gluten source. ",
    Allergies2:"The pastry recipe often calls for butter or margarine (which often contains whey/milk solids) to create a flaky or tender crust. "
  },
  {
    Image: "foods/pl.png",
    name: "Plasas",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Plasas (also known as Palaver Sauce) is a beloved West African stew, particularly popular in The Gambia and Sierra Leone. It is a rich, hearty, and often spicy green leaf stew that serves as a staple comfort food.",
    Allergies1:"Peanuts (Groundnuts): Can trigger anaphylactic shock (rapid throat swelling and drop in blood pressure) in sensitive individuals.",
    Allergies2:"Sesame (Ogiri): If made with fermented sesame, it can cause intense itching, swelling, or systemic allergic reactions."
  },
   {
    Image:
     "foods/bu.png",
    name: "Burger Beef",
    rating: {
      stars: 3,
      count: 49,
    },
    price: 150,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"A standard Western-style beef patty served on a bun, augmented by a slice of cheese. features a seasoned ground beef patty cooked and placed inside a sliced, often toasted, wheat bun. ",
    Allergies1:"The burger bun is a major source of wheat/gluten. Additionally, breadcrumbs or flour may be mixed into the beef patty as a binding agent.",
    Allergies2:"Sesame seeds are the standard topping for most commercially available burger buns, and the oil from the seeds is a common allergen."
  },
   

  
  {
    Image: "foods/ff.png",
    name: "FuFu",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Fufu is a smooth, dense, sticky, and dough-like staple food widely eaten across West Africa and the Caribbean. It's often referred to as a 'swallow food' because it's traditionally pinched into a ball, dipped in soup or stew, and swallowed without chewing.",
    Allergies1:"contamination is possible if it's made from a composite mix or commercially prepared fufu flour. Potential allergens are most commonly found in the soup or stew that Fufu is served with, such as Fish/Shellfish, Peanuts, Soy.",
    Allergies2:"Dairy (if butter is used in the preparation, as in some Caribbean versions), which can trigger reactions ranging from mild to severe anaphylaxis."
  }, {
    Image: "foods/bbbb.png",
    name: "Benechine",
    rating: {
      stars: 2.5,
      count: 99,
    },
    price: 100,
    thumbs: {
      thumbsup: 20,
      thumbsdown: 25,
    },info:"Benechin, which means 'one pot' in Wolof, is the Gambian variation of Jollof Rice (and is similar to Senegalese Thieboudienne). It is a rich, seasoned rice dish cooked in a single pot with a flavorful tomato-based sauce. ",
    Allergies1:"(Maggi/Jumbo) which are essential for the flavor base, and these can cause varied allergic or sensitivity reactions (e.g., skin issues, digestive upset, or asthma symptoms).",
    Allergies2:" Common when the dish is made as Thieboudienne (with fish) or if dried, salted, or fermented fish/conch (yet, guedj) is used as a flavor enhancer. Reactions can range from hives to severe anaphylaxis."
  },
  
];
