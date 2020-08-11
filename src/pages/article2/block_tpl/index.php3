<% for(var css in htmlWebpackPlugin.files.css){ %>
  <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
<% } %>
<% var UEditor = '', article2 = '', manifest = '', vendor = '' %>
<% for (var chunk in htmlWebpackPlugin.files.chunks){ %>
  <% if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('UEditor') > -1) { %>
    <% UEditor = htmlWebpackPlugin.files.chunks[chunk].entry %>
  <% } %>
  <% if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('article2') > -1) { %>
    <% article2 = htmlWebpackPlugin.files.chunks[chunk].entry %>
  <% } %>
  <% if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('manifest') > -1) { %>
    <% manifest = htmlWebpackPlugin.files.chunks[chunk].entry %>
  <% } %>
  <% if (htmlWebpackPlugin.files.chunks[chunk].entry.indexOf('vendor') > -1) { %>
    <% vendor = htmlWebpackPlugin.files.chunks[chunk].entry %>
  <% } %>
<% } %>

<script>
  require.config({
    paths: {
      'UEditor': '<%= UEditor.replace(/.js$/i, '') %>',
      'product': '<%= article2.replace(/.js$/i, '') %>'
    },
    shim: {
      'UEditor': {
        deps: [
          '<%= manifest %>',
          '<%= vendor %>'
        ]
      },
      'product': {
        deps: ['UEditor']
      }
    }
  });
</script>
