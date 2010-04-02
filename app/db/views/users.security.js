
{
   "by_email": {
       "map": "function(doc) { \t    emit(doc.email, doc); \t}"
   },
   "by_username": {
       "map": "function(doc) { \t    emit(doc.username, doc); \t}"
   },
   "login": {
       "map": "function(doc) { \n  var value= {_id:true,username:true,email:true};\n  for (attr in doc) {\n    if (value[attr]) {\n      value[attr]=doc[attr];\n    }\n  }\n  emit([doc.username,doc.password], value);\n}"
   }
}
