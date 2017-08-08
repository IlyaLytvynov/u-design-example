/**
 * Created by IlyaLitvinov on 08.08.17.
 */
function add(a){
  let result = a;
  const _add = function (b) {
    result = result+b;
    return add(result);
  };
  _add.prototype.valueOf = function () {
    return result
  };

  return _add;
}


add(2)(2)(2);
