<?php

namespace App\Tests;

use App\Domain\User\UserStorage;
use App\Infrastructure\Fixtures\UserFixtures;
use Generator;
use HWI\Bundle\OAuthBundle\Security\Core\Authentication\Token\OAuthToken;
use function serialize;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

final class SmokeTest extends WebTestCase
{
    /**
     * @dataProvider anonUrls
     */
    public function testAnon(string $url, string $method, int $statusCode): void
    {
        $client = static::createClient();

        $client->request($method, $url);
        $response = $client->getResponse();

        static::assertSame($statusCode, $response->getStatusCode());
    }

    public function anonUrls(): Generator
    {
        yield ['/login/', 'GET', 200];
        yield ['/', 'GET', 302];
    }

    /**
     * @dataProvider loggedUrls
     */
    public function testLoggedIn(string $url, string $method, int $statusCode): void
    {
        $client = static::createClient();
        $this->logIn($client);

        $client->request($method, $url);
        $response = $client->getResponse();

        static::assertSame($statusCode, $response->getStatusCode());
    }

    public function loggedUrls(): Generator
    {
        yield ['/', 'GET', 200];
        yield ['/', 'POST', 200];
    }

    /**
     * @dataProvider ajaxUrls
     */
    public function testAjax(string $url, string $method, int $statusCode): void
    {
        $client = static::createClient();
        $this->logIn($client);

        $client->xmlHttpRequest($method, $url);
        $response = $client->getResponse();

        static::assertSame($statusCode, $response->getStatusCode());
    }

    public function ajaxUrls(): Generator
    {
        yield ['/', 'GET', 200];
    }

    private function logIn(KernelBrowser $client): void
    {
        /** @var SessionInterface $session */
        $session = self::$container->get('session');
        $user = self::$container->get(UserStorage::class)->getByUsername(UserFixtures::USERNAME);

        $token = new OAuthToken('SomeToken', []);
        $token->setUser($user);
        $token->setAuthenticated(true);

        $session->set('_security_main', serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $client->getCookieJar()->set($cookie);
    }
}
