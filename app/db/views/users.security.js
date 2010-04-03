
{
   "by_email": {
       "map": "function(doc) { \t    emit(doc.email, doc); \t}"
   },
   "by_username": {
       "map": "function(doc) { \t    emit(doc.username, doc); \t}"
   },
   "login": {
       "map": "function(doc) { \n  var value= {_id:true,username:true,email:true};\n  for (attr in doc) {\n    if (value[attr]) {\n      value[attr]=doc[attr];\n    }\n  }\n  emit([doc.email,doc.username,doc.password], value);\n}"
   }
   "login_email": {
       "map": "function(doc) { emit([doc.email,doc.password],null) }"
   },
   "username_email": {
       "map": "function(doc) { emit([doc.username,doc.password],null) }"
   }
}
