UE.plugins['my_style'] = function () {

  var me = this
  me.commands['title_h3'] = {
    execCommand: function () {
      var me = this

      if (me.queryCommandState('title_h3') == 1) {
        var range = me.selection.getRange()
        var path = this.selection.getStartElementPath()
        for (var i = 0; i < path.length; i++) {
          if (path[i].tagName == 'H3') {
            var p = me.document.createElement('p')
            var textNode
            if (path[i].innerText) {
              textNode = me.document.createTextNode(path[i].innerText)
            } else {
              textNode = path[i].firstChild
            }
            p.appendChild(textNode)
            path[i].parentNode.replaceChild(p, path[i])
            range.setStart(textNode, range.startOffset)
              .setEnd(textNode, range.endOffset).collapse(true).select(true)
            break
          }
        }
      } else {
        me.execCommand('Paragraph', 'h3', {
          'class': 'title_h3'
        })
      }
    },
    queryCommandState: function () {
      var pN = domUtils.filterNodeList(this.selection.getStartElementPath(), 'h3')
      return pN ? 1 : 0
    }
  }

  var commands = [{
    name: 'insertorderedlist2',
    dist: 'insertorderedlist'
  }, {
    name: 'insertunorderedlist2',
    dist: 'insertunorderedlist'
  }
  ]
  for (var i = 0; i < commands.length; i++) {
    var item = commands[i]
    var cmd = item.dist;
    (function (cmd, item) {
      me.commands[item.name] = {
        execCommand: function () {
          var value = this.queryCommandValue(cmd) || undefined
          this.execCommand(cmd, value)
        },
        queryCommandState: function () {
          return this.queryCommandState(cmd)
        }
      }
    })(cmd, item)
  }

  me.commands['remote_catch'] = {
    execCommand: function () {
      var me = this
      if (me.queryCommandState('remote_catch') == 1) {
        me.fireEvent('catchRemoteImage')
      }
    },
    queryCommandState: function () {
      return 1
    }
  }

  var commandsDialog = ['highlighting_keywords', 'insert_card', 'insert_video', 'insert_image', 'full_screen']
  for (var i = 0; i < commandsDialog.length; i++) {
    (function (command) {
      me.commands[command] = {
        execCommand: function () {
          var me = this, flage = 'flage-' + command
          me[flage] = !me[flage]
          if (command === 'full_screen') {
            me.$emitEvent(command, me[flage])
          } else if (me.queryCommandState(command) == 1) {
            me.$emitEvent(command, me[flage])
          }
        },
        queryCommandState: function () {
          if (command === 'full_screen') {
            return me.fullScreen ? 1 : 0
          }
          return 1
        }
      }
    })(commandsDialog[i])
  }

  me.commands['new_link'] = {
    execCommand: function () {
      var me = this
      var state = me.queryCommandState('new_link')

      var range = me.selection.getRange()
      var rangeLink = domUtils.findParentByTagName(range.getCommonAncestor(), 'a', true)
      //已经有链接
      //目标：去除链接
      if (state == 1) {
        var newEle = me.document.createTextNode(rangeLink.textContent)
        rangeLink.parentElement.replaceChild(newEle, rangeLink)
      }
      //弹窗设置链接
      else if (state == 0) {
        me.$emitEvent('new_link', range)
      }
      //不可设置链接
      else if (state == -1) {

      }
    },
    queryCommandState: function () {

      var editor = this
      var range = editor.selection.getRange()
      var rangeCommon = range.getCommonAncestor()
      var rangeLink = domUtils.findParentByTagName(rangeCommon, 'a', true)
      if (rangeLink) {
        if (!range.collapsed) {
          return 0
        }
        return 1
      }
      if (range.collapsed) {
        // 这里有个bug先不解决
        // if(
        //   range.startContainer == range.endContainer &&
        //   range.startContainer.nextSibling &&
					// range.startContainer.nextSibling.tagName == 'A'
        // ){
					// return 1
        // }
        return -1
      }

      var fragment = range.cloneContents()
      var node = document.createElement("div")
      node.appendChild(fragment)
      //包含有图片
      if (node.getElementsByTagName('img').length) {
        return -1
      }
      return 0
    }
  }

// 一键排版
  /*
  *     排版规则
  *     1、清空开头空格格式
  *     2、文章开头设置小标题：上不空行
  *     3、小标题位置，上下强制不空行
  *     4、文字段落/文字段落 之间空一行
  *     5、文字段落/图片 之间空一行
  *     6、图片/图片 之间空一行
  *     7、删除文章最后的空行
  * */

  me.commands['quick_layout'] = {
    execCommand: function () {
      var cont = me.document.body
      var nodes = cont.childNodes
      var whiteLineList=[],needWhiteLineList=[]
      var next,tmpNode
      // console.log(nodes)
     for(var i=0,ci;ci=nodes[i++];){
       if(ci in whiteLineList){
         continue
       }
     //   清空开头空格格式
       var innerHTML = ci.innerHTML.replace(/(^(&nbsp;)*)/g, "")
       ci.innerHTML = innerHTML

     //   文章开头设置小标题：上不空行
       if(isLine(ci)){
         next = ci.nextSibling;
         var leftWhiteLineList = [ci],isNextTitle=false
         while(isLine(next) || (next && next.nodeName === 'H3')){
           tmpNode = next
           next = tmpNode.nextSibling
           if(tmpNode.nodeName === 'H3'){
             isNextTitle=true
             break;
           }

           leftWhiteLineList.push(tmpNode)
         }
         if(isNextTitle){
           whiteLineList = whiteLineList.concat(leftWhiteLineList)
         }
       }

     // 小标题位置，上下强制不空行
      if(ci.nodeName === 'H3'){
        next = ci.nextSibling
        var rightWhiteLineList = []
        while(isLine(next)){
          tmpNode = next
          next = tmpNode.nextSibling

          rightWhiteLineList.push(tmpNode)
        }
        whiteLineList = whiteLineList.concat(rightWhiteLineList)
      }

      //合并段落/段落之间的空行
       if(ci.nodeName === 'P' && !isLine(ci)){
         next = ci.nextSibling
         var mergeWhiteLineList = []
         while(isLine(next)){
           tmpNode = next
           next = tmpNode.nextSibling
           if(isLine(next)){
             mergeWhiteLineList.push(tmpNode)
           }
         }
         whiteLineList = whiteLineList.concat(mergeWhiteLineList)
       }

     // 文字段落/文字段落 之间空一行
       if(ci.nodeName === 'P' && !isLine(ci)){
         next = ci.nextSibling
         if(next && next.nodeName === 'P' && !isLine(next)){
           needWhiteLineList.push(ci)
         }

         // 删除非空白行中的br换行
         var ciNodes = ci.childNodes
         for(var j = ciNodes.length - 1; j >= 0; j--){
           var item = ciNodes[j]
           if(domUtils.isBr(item)){
             domUtils.remove(item)
           }
         }
       }

       // 删除最后一行空行
       if(i === nodes.length && isLine(ci)){
         whiteLineList.push(ci)
       }

     }
     //删除空行
      whiteLineList.forEach(item=>{
        domUtils.remove(item)
      })
      //添加空行
      needWhiteLineList.forEach(item=>{
        var node = document.createElement('p')
        domUtils.fillNode( me.document, node )
        domUtils.insertAfter(item,node)
      })
    },
    queryCommandState: function () {
      return 1
    }
  }

  // 检测是否是空行
  function isLine(node,notEmpty){
    if(!node || node.nodeType == 3)
      return 0;
    if(domUtils.isBr(node))
      return 1;
    if(node && node.parentNode){
      return notEmpty ? !domUtils.isEmptyBlock(node) : domUtils.isEmptyBlock(node,new RegExp('[\\s'+domUtils.fillChar
        +']','g'));
    }
  }

}

