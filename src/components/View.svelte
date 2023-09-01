<script>
    import PocketBase from 'pocketbase';
    import Videos from './Videos.svelte';
    import { onMount } from 'svelte';
    const pb = new PocketBase('https://pocketbase-production-b48b.up.railway.app');
    var listVideos = [];
    
    async function getList() {
     const records = await pb.collection('videos').getFullList({
        sort: '-created',
        });
    
        return records;
    }
    onMount(() => {
                getList().then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].file == 1) {
                        let url = pb.files.getUrl(result[i], result[i].file);
                        listVideos.push(url);
                    } else {
                        for (let j = 0; j < result[i].file.length; j++) {
                            let url = pb.files.getUrl(result[i], result[i].file[j]);
                            listVideos.push(url);
                        }
                    }
                }

                listVideos = listVideos
            })
    });

</script>

<main>
  

            <Videos gap="15" maxColumnWidth="400">
                {#each listVideos as video}
                    <img src={video} alt="">
                {/each}
            </Videos>



</main>
