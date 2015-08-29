requirejs.config({
    baseUrl: 'js',
    
    paths: {
        "firebase": "lib/firebase",
        "jquery": "lib/jquery",
        "jquerymobile": "lib/jquerymobile"
    }
});

require(['main_v2'], function(main) {
    main();
});