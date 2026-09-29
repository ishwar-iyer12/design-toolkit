/* SAMPLE DATA. Invented orders for a coffee roaster, so the page has something to show.
   Replace loadOrders() in app.js with a request to the real orders API.

   Fields: number, customer (null when none was recorded), minutesAgo (placed, relative
   to page load so the date filters always have something to match), items, total in USD,
   status. */
window.SAMPLE_ORDERS = [
  ["FH-10482", "Amara Okonkwo", 14, 3, 58.50, "Awaiting payment"],
  ["FH-10481", "Tomasz Wieczorek", 47, 1, 19.00, "Paid"],
  ["FH-10480", "Priya Raghunathan", 95, 6, 131.40, "Paid"],
  ["FH-10479", "Lucía Fernández Prieto", 160, 2, 41.00, "Roasting"],
  ["FH-10478", null, 212, 1, 6.50, "Paid"],
  ["FH-10477", "Hollis & Finch Bakery", 305, 24, 412.80, "Roasting"],
  ["FH-10476", "Kenji Morimoto", 420, 2, 37.00, "Payment failed"],
  ["FH-10475", "Saoirse Gallagher", 780, 4, 76.00, "Roasting"],
  ["FH-10474", "Dawit Tesfaye", 1130, 1, 22.50, "Shipped"],
  ["FH-10473", "Marguerite Aubert", 1395, 3, 64.25, "Shipped"],
  ["FH-10472", "The Lantern Room Cafe", 1710, 40, 688.00, "Shipped"],
  ["FH-10471", "Ravi Subramaniam", 2240, 2, 39.00, "Shipped"],
  ["FH-10470", "Ingrid Solberg", 2890, 5, 97.75, "Delivered"],
  ["FH-10469", "Carlos Mendonça", 3400, 1, 19.00, "Refunded"],
  ["FH-10468", "Nomvula Dlamini", 4120, 2, 44.00, "Delivered"],
  ["FH-10467", "Beatrix van Houten", 4985, 3, 58.50, "Delivered"],
  ["FH-10466", "Wren Street Office Pantry", 5630, 12, 216.00, "Delivered"],
  ["FH-10465", "Yusuf Demirci", 6410, 1, 24.00, "Delivered"],
  ["FH-10464", "Eleni Papadakis", 7300, 4, 81.20, "Payment failed"],
  ["FH-10463", "Oluwaseun Adeyemi", 8050, 2, 38.00, "Delivered"],
  ["FH-10462", "Hana Kobayashi", 9275, 1, 17.50, "Delivered"],
  ["FH-10461", "Fergus MacAllister", 10480, 6, 119.00, "Delivered"],
  ["FH-10460", "Anneliese Brandt", 11820, 2, 41.00, "Refunded"],
  ["FH-10459", "Hollis & Finch Bakery", 13010, 24, 412.80, "Delivered"],
  ["FH-10458", "Thandiwe Mokoena", 14390, 3, 61.75, "Delivered"],
  ["FH-10457", "Julien Carpentier", 16200, 1, 22.50, "Delivered"],
  ["FH-10456", "Mei-Ling Zhou", 18700, 2, 46.00, "Delivered"],
  ["FH-10455", "Bartholomew Quist", 21350, 5, 102.30, "Delivered"],
  ["FH-10454", "The Lantern Room Cafe", 24100, 36, 619.20, "Delivered"],
  ["FH-10453", "Isadora Nascimento", 27600, 1, 19.00, "Delivered"],
  ["FH-10452", "Callum Ashworth", 31900, 3, 57.00, "Refunded"],
  ["FH-10451", "Zainab Al-Rashid", 36500, 2, 43.50, "Delivered"],
  ["FH-10450", "Ottoline Pryce", 40800, 4, 78.00, "Delivered"],
  ["FH-10449", "Wren Street Office Pantry", 45200, 12, 216.00, "Delivered"]
];
